import React from 'react';
import ReactMapGL, { FlyToInterpolator, NavigationControl } from 'react-map-gl';
import WindowResizeListener from 'react-window-size-listener';
import classnames from 'classnames';
import MapboxGl from 'mapbox-gl';
import {
  getThousandSeparator,
  transformPonderableName,
  getTotalHeaderAndFooterHeight,
  filterPonderables,
} from '../../utils';
import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';
import sauGeoJson from '../../assets/geojsons/sau.json';
import chnGeoJson from '../../assets/geojsons/chn.json';
import indGeoJson from '../../assets/geojsons/ind.json';
import usaGeoJson from '../../assets/geojsons/usa.json';
import eurGeoJson from '../../assets/geojsons/eur.json';
import {
  RegionIcon,
  FuelIcon,
  Co2Icon,
  TonsIcon,
  YearIcon,
  Co2RtlIcon,
  GDPIcon,
  EmploymentIcon,
} from '../customIcon';
import IntlMessages from '../Misc/intlMessages';
import { localeMessages } from '../../configs/app.config';
import AppLocaleProvider from '../../locales/AppLocaleProvider';

MapboxGl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js'
);

let styles = {};

const MAPBOX_TOKEN =
  'pk.eyJ1Ijoia2Fwc2FyYzEiLCJhIjoiY2p3cWJidTRqMmNscDQ4bzU4ZDNvNW1hbCJ9.gXclXa3CaCvdnUPT1GFRbQ';
//  'pk.eyJ1Ijoicm1kZ2FuZXNhbiIsImEiOiJjanM5ejFjeXQxZ2tiNGJzOGtwY282aWJ3In0.gU1HWYG05mY6ai1fpmFE3Q';

function getColorForRange(value, colorStops) {
  for (let index = 0; index < colorStops.length; index += 1) {
    const colorStop = colorStops[index];
    if (colorStop.range <= value) {
      return colorStop.color;
    }
  }
  return 255;
}

function updateColorCodes(featureCollection, countryMapBau, selectedPonderable, colorStops) {
  const { features } = featureCollection;
  features.forEach(f => {
    const region = f.properties[countryMapBau.geoMappingField];
    const record = countryMapBau.data.find(item => item.mappingFieldValue === region);
    if (record) {
      f.properties.colorCodes = Math.min(
        getColorForRange(record[selectedPonderable], colorStops),
        255
      );
      f.properties.selectedPonderable = selectedPonderable;
      f.properties.mapBauData = { ...record, year: countryMapBau.year };
    } else {
      f.properties.colorCodes = 0;
    }
  });
}

class Mapbox extends React.Component {
  state = {
    viewport: {
      latitude: 23.885942,
      longitude: 45.079163,
      zoom: 4,
      bearing: 0,
      pitch: 0,
    },
    hoveredFeature: null,
    winHeight: '100vh',
  };

  handleHover = evt => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = evt;
    evt.stopPropagation();
    const hoveredFeature = features && features.find(f => f.layer.id === 'country_au1');
    const { hoveredFeature: existingHover } = this.state;
    if (existingHover) {
      const map = this.mapRef.getMap();
      map.setFeatureState({ source: 'country_states', id: existingHover.id }, { hover: false });
    }
    this.setState({ hoveredFeature, x: offsetX, y: offsetY });
  };

  getPonderableIcon = item => {
    const { direction } = this.props;
    const ponderableIcon = {
      fuel: <FuelIcon className={styles.icon} />,
      co2: <Co2Icon className={styles.icon} />,
      freight: <TonsIcon className={styles.icon} />,
      gdp: <GDPIcon className={styles.icon} />,
      employment: <EmploymentIcon className={styles.icon} />,
    };
    if (item === 'tons') {
      return <TonsIcon className={styles.icon} />;
    }
    if (item === 'co2' && direction === 'rtl') {
      return <Co2RtlIcon className={styles.icon} />;
    } else {
      return ponderableIcon[item];
    }
  };

  renderTooltip = () => {
    const { selectedPonderable, direction } = this.props;
    const { hoveredFeature, x, y } = this.state;
    const {
      globalParameters: { ponderables },
      selectedCountry,
      selectedYear,
    } = this.props;
    let ponderableData = ponderables;
    if (selectedCountry && selectedCountry.id === 1 && selectedYear > 2017) {
      ponderableData = filterPonderables(ponderables);
    }
    let mapBauData = {};
    if (hoveredFeature && hoveredFeature.properties.mapBauData) {
      const map = this.mapRef.getMap();
      map.setFeatureState({ source: 'country_states', id: hoveredFeature.id }, { hover: true });
      mapBauData = JSON.parse(hoveredFeature.properties.mapBauData);
      // mapBauData.color = hoveredFeature.properties.colorCodes;
      return (
        <div className={styles.tooltip} style={{ left: x, top: y }} dir={direction}>
          <div className={styles.tooltipList}>
            <div>
              <RegionIcon className={styles.icon} />
            </div>
            <div style={{ fontSize: '12px', paddingLeft: '10px' }}>
              <div className={styles.title}>
                <IntlMessages id="simulator.tooltip.region" />
              </div>
              <div>{mapBauData.region.toUpperCase()}</div>
            </div>
          </div>
          <div className={styles.tooltipList} style={{ backgroundColor: '#efefef' }}>
            <div>
              <YearIcon className={styles.icon} />
            </div>
            <div style={{ fontSize: '12px', paddingLeft: '10px' }}>
              <div className={styles.title}>
                <IntlMessages id="simulator.tooltip.year" />
              </div>
              <div>{mapBauData.year}</div>
            </div>
          </div>
          {ponderableData.map(item => {
            const styleObj = {
              fontSize: '12px',
              display: 'flex',
            };
            return (
              <div
                key={`region_tooltip_${item.id}`}
                style={styleObj}
                className={classnames(
                  styles.predefinedEven,
                  item.ponderableCode === selectedPonderable ? styles.activePonderable : ''
                )}
              >
                <div>{this.getPonderableIcon(item.ponderableCode)}</div>
                <div style={{ paddingLeft: '10px' }}>
                  <div className={styles.title}>
                    <span style={{ textTransform: 'uppercase' }}>
                      {transformPonderableName(item)}
                    </span>{' '}
                    ( {item.unit} )
                  </div>

                  <div>{getThousandSeparator(mapBauData[item.ponderableCode])}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  removeActiveLayer = map => {
    if (map.getLayer('country_au1')) {
      map.removeLayer('state-borders');
      map.removeLayer('country_au1');
      map.removeSource('country_states');
    }
  };

  updateMapBox = noViewport => {
    noViewport = noViewport || false;
    const { selectedCountry } = this.props;
    const { viewport } = this.state;
    const map = this.mapRef ? this.mapRef.getMap() : null;

    if (!map || (map && !map.isStyleLoaded())) {
      this.updateMapBoxTimeOut = setTimeout(this.updateMapBox, 100);
      return;
    }

    if (this.updateMapBoxTimeOut) {
      clearTimeout(this.updateMapBoxTimeOut);
    }

    if (!selectedCountry) {
      return;
    }
    const dataSource = this.getDataSourceJson(selectedCountry.longName.toLowerCase());
    this.removeActiveLayer(map);
    if (dataSource) {
      // map.addControl(new MapboxLanguage({ defaultLanguage: 'ar' }));
      // if (map) {
      //   map.setLayoutProperty('country-label', 'text-field', ['get', `name_${locale}`]);
      //   map.setLayoutProperty('state-label', 'text-field', ['get', `name_${locale}`]);
      //   map.setLayoutProperty('settlement-label', 'text-field', ['get', `name_${locale}`]);
      // }
      if (!map.getLayer('country_au1')) {
        this.addCountryAu1Layer(map, dataSource);
      }
    }
    // map.panTo([parseFloat(selectedCountry.longitude), parseFloat(selectedCountry.latitude)]);
    // setTimeout(this.setCenter.bind(this), 600);
    if (!noViewport) {
      const newViewport = { ...viewport };
      newViewport.latitude = parseFloat(selectedCountry.latitude);
      newViewport.longitude = parseFloat(selectedCountry.longitude);
      newViewport.zoom = 4;
      newViewport.transitionInterpolator = new FlyToInterpolator();
      newViewport.transitionDuration = 1000;

      this.handleViewportChange(newViewport);
    }
  };

  setCenter = () => {
    const { selectedCountry } = this.props;
    const { viewport } = this.state;
    const newViewport = { ...viewport };
    newViewport.latitude = parseFloat(selectedCountry.latitude);
    newViewport.longitude = parseFloat(selectedCountry.longitude);
    this.setState({ viewport: { ...newViewport } });
  };

  getDataSourceJson = key => {
    if (key === 'sau') {
      return sauGeoJson;
    } else if (key === 'ind') {
      return indGeoJson;
    } else if (key === 'chn') {
      return chnGeoJson;
    } else if (key === 'usa') {
      return usaGeoJson;
    } else if (key === 'eur') {
      return eurGeoJson;
    }
    return null;
  };

  getMapImage = () => {
    const {
      selectedCountry: { name },
      locale,
      selectedYear,
      selectedPonderable,
      globalParameters: { ponderables },
    } = this.props;
    const map = this.mapRef.getMap();
    const canvas = map.getCanvas(); // getHtmlToImg(document.getElementById('mapBox'));
    const mapContent = localeMessages[`choroplethMap_${locale}`].concat(' ', name);
    const yearContent = localeMessages[`choroplethYear_${locale}`].concat(' = ', selectedYear);

    const ponderable = ponderables.find(elem => elem.ponderableCode === selectedPonderable);

    const ponderableContent = ponderable
      ? `${localeMessages[`ponderable_${locale}`]} ${transformPonderableName(ponderable)} - ${
          ponderable.unit
        }`
      : `${localeMessages[`ponderable_${locale}`]}`;

    const dataURL = this.watermarkedDataURL(canvas, mapContent, yearContent, ponderableContent);
    const imgData = dataURL.toDataURL('image/png');
    return imgData;
  };

  watermarkedDataURL = (canvas, mapText, yearText, ponderableText) => {
    const { locale } = this.props;
    const tempCanvas = document.createElement('canvas');

    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.font = '30px verdana';
    tempCtx.translate(250, 0);
    const textWidth = tempCtx.measureText(mapText).width;
    const textHeight = 80;
    if (locale === 'ar') {
      tempCtx.textAlign = 'right';
      tempCtx.fillText(mapText, tempCanvas.width - textWidth, textHeight / 2);
      tempCtx.textAlign = 'right';
      tempCtx.fillText(yearText, tempCanvas.width - textWidth, textHeight / 1.1);
      tempCtx.textAlign = 'right';
      tempCtx.fillText(ponderableText, tempCanvas.width - textWidth, textHeight / 0.75);
    } else {
      tempCtx.fillText(mapText, -textWidth / 2, textHeight / 2);
      tempCtx.fillText(yearText, -textWidth / 2, textHeight / 1.1);
      tempCtx.fillText(ponderableText, -textWidth / 2, textHeight / 0.75);
    }

    return tempCanvas;
  };

  getColorBySlideValue = value => {
    const { colorStops } = this.props;
    const founded = colorStops.find(stop => stop.sliderValue === value);
    if (founded) {
      return founded.color;
    }
    return colorStops.length ? colorStops[colorStops.length - 1].color : '';
  };

  getLayerPaintOptions = () => {
    const { currentColorSliderValue } = this.props;
    const options = {
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0.7],
    };
    options['fill-color'] = [
      'case',
      [
        'all',
        ['<=', ['get', 'colorCodes'], this.getColorBySlideValue(currentColorSliderValue[0])],
        ['>=', ['get', 'colorCodes'], this.getColorBySlideValue(currentColorSliderValue[1])],
      ],
      ['rgb', 0, ['get', 'colorCodes'], 0],
      ['rgba', 255, 255, 255, 0],
    ];

    return options;
  };

  addCountryAu1Layer = (map, dataSource) => {
    const { countryMapBau, colorStops, selectedPonderable } = this.props;
    if (!countryMapBau) {
      return null;
    }
    updateColorCodes(dataSource, countryMapBau, selectedPonderable, colorStops);
    map.addSource('country_states', {
      type: 'geojson',
      data: dataSource,
      generateId: true,
    });
    map.addLayer({
      id: 'country_au1',
      type: 'fill',
      source: 'country_states',
      layout: {},
      interactive: true,
      paint: this.getLayerPaintOptions(selectedPonderable),
    });
    map.addLayer({
      id: 'state-borders',
      type: 'line',
      source: 'country_states',
      layout: {},
      paint: {
        'line-color': 'rgb(0,60,10)',
        'line-width': 2,
      },
    });
  };

  handleViewportChange = viewport => {
    this.setState({ viewport: { ...viewport } });
  };

  handleMapClick = () => {
    const { mobileDrawerClose } = this.props;
    mobileDrawerClose();
  };

  render() {
    const { viewport, winHeight } = this.state;
    const { direction, isMobile } = this.props;
    const appLocale = this.context;
    const newViewport = { ...viewport };
    const rootHeight = winHeight - getTotalHeaderAndFooterHeight(isMobile);
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const { locale } = appLocale;
    return (
      <React.Fragment>
        <WindowResizeListener
          onResize={windowSize => {
            this.setState({
              winHeight: windowSize.windowHeight,
            });
          }}
        />
        <div style={{ height: `${rootHeight}px`, width: '100vw' }} dir="ltr">
          <ReactMapGL
            ref={ref => (this.mapRef = ref)}
            {...newViewport}
            width="100%"
            height="100%"
            mapStyle={
              locale === 'ar'
                ? 'mapbox://styles/kapsarc1/cjwqbu62a228q1cqj5mkpbezh'
                : 'mapbox://styles/kapsarc1/cjwqc19r604771cmndgk2ptvf'
            }
            onViewportChange={this.handleViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onHover={this.handleHover.bind(this)}
            preserveDrawingBuffer
            onClick={this.handleMapClick.bind(this)}
          >
            {this.renderTooltip()}
            <div className={styles.mapBoxNavigation}>
              <NavigationControl onViewportChange={this.handleViewportChange} showCompass={false} />
            </div>
          </ReactMapGL>
        </div>
      </React.Fragment>
    );
  }
}

Mapbox.contextType = AppLocaleProvider;

export default Mapbox;
