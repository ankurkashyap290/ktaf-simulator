import _ from 'lodash';
import lowdb from 'lowdb';
import Memory from 'lowdb/adapters/Memory';
import lodashId from 'lodash-id';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import mockData from '../mockData.json';
import { apiUrl, siteConfig } from '../configs/app.config';

const API_URL = apiUrl(''); // ""
const uuid = (a, b) => {
  for (
    b = a = '';
    (a += 1 < 36);
    b += (a * 51) & 52 ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16) : '-'
  );
  return b;
};

const deepQuery = (value, q) => {
  if (value && q) {
    if (this.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        if (this.deepQuery(value[i], q)) {
          return true;
        }
      }
    } else if (this.isObject(value) && !this.isArray(value)) {
      for (const k in value) {
        if (this.deepQuery(value[k], q)) {
          return true;
        }
      }
    } else if (
      value
        .toString()
        .toLowerCase()
        .indexOf(q) !== -1
    ) {
      return true;
    }
  }
};
const createId = coll => {
  const idProperty = this.__id();
  if (this.isEmpty(coll)) {
    return 1;
  } else {
    let id = this(coll).maxBy(idProperty)[idProperty];

    // Increment integer id or generate string id
    return this.isFinite(id) ? (id += 1) : uuid();
  }
};

class MockDataReader {
  static mockDb = null;

  constructor() {
    this.mockDb = lowdb(new Memory());
    this.mockDb.setState(mockData);
    this.mockDb._.mixin(lodashId);
    this.mockDb._.mixin({ deepQuery, createId });
  }

  login = (dbName, options) => {
    const payload = JSON.parse(options.body);
    const user = this.mockDb
      .get(dbName)
      .find({ username: payload.username, password: payload.password })
      .value();
    if (user) {
      const tokenPayload = {
        iss: siteConfig.siteName,
        sub: user.id,
        user_id: user.id,
        role: user.role,
        name: user.username,
        avatar: user.avatar,
        exp: new Date().getTime() + 31536000, // expiry seconds =  one year
      };
      const token = jwt.sign(tokenPayload, siteConfig.tokenSalt);
      return {
        status: 'ok',
        data: { token },
        headers: new Headers(),
      };
    } else {
      return {
        status: 'error',
        info: 'Invalid username or password',
        headers: new Headers(),
      };
    }
  };

  removeAll = (dbName, options) => {
    const table = this.mockDb.get(dbName);
    const removeList = options.body.remove || [];
    const result = table
      .removeWhere(elem => {
        return removeList.includes(elem.id);
      })
      .value();
    return {
      status: 'ok',
      data: result.map(elem => {
        return elem.id;
      }),
      headers: new Headers(),
    };
  };

  createItem = (dbName, options) => {
    const table = this.mockDb.get(dbName);
    const newItem = table.insert(JSON.parse(options.body)).value();
    return {
      status: 'ok',
      data: newItem,
      headers: new Headers(),
    };
  };

  readItem = (dbName, options) => {
    let result = this.mockDb
      .get(dbName)
      .getById(options.recordId || 0)
      .value();

    if (result) {
      // Clone resource to avoid making changes to the underlying object
      result = _.cloneDeep(result);
      return {
        status: 'ok',
        data: result,
        headers: new Headers(),
      };
    } else {
      return {
        status: 'error',
        data: null,
        info: 'Item not found',
        headers: new Headers(),
      };
    }
  };

  updateItem = (dbName, options) => {
    const recordId = options.recordId;
    let table = this.mockDb.get(dbName);

    table = table.updateById(recordId, JSON.parse(options.body));

    const result = table.value();

    if (result) {
      return {
        status: 'ok',
        data: result,
        headers: new Headers(),
      };
    } else {
      return {
        status: 'error',
        data: null,
        info: 'Update Item Failed',
        headers: new Headers(),
      };
    }
  };

  deleteItem = (dbName, options) => {
    const result = this.mockDb
      .get(dbName)
      .removeById(options.recordId)
      .value();
    if (result) {
      return {
        status: 'ok',
        data: result,
        headers: new Headers(),
      };
    } else {
      return {
        status: 'error',
        data: null,
        info: 'Delete Item Failed',
        headers: new Headers(),
      };
    }
  };

  list = (dbName, options) => {
    const queryParams = qs.parse(options.queryParams, {
      ignoreQueryPrefix: true,
    });
    let q = queryParams.q;
    const searchKey = queryParams.searchKey ? queryParams.searchKey : null;
    let _page = queryParams._page;
    let _limit = queryParams._limit;
    const _sort = queryParams._sort;
    const _order = queryParams._order;

    let table = this.mockDb.get(dbName);
    let result = null;

    // Automatically delete query parameters that can't be found
    // in the database
    Object.keys(queryParams).forEach(query => {
      const arr = table.value();
      for (const i in arr) {
        if (
          _.has(arr[i], query) ||
          query === 'callback' ||
          query === '_' ||
          /_lte$/.test(query) ||
          /_gte$/.test(query) ||
          /_ne$/.test(query) ||
          /_like$/.test(query)
        )
          return;
      }
      delete queryParams[query];
    });

    if (q) {
      // Full-text search
      if (Array.isArray(q)) {
        q = q[0];
      }

      q = q.toLowerCase();
      const mockDb = this.mockDb;
      table = table.filter(obj => {
        if (searchKey) {
          if (mockDb._.deepQuery(obj[searchKey], q)) {
            return true;
          }
        } else {
          for (const key in obj) {
            if (obj) {
              const value = obj[key];
              if (mockDb._.deepQuery(value, q)) {
                return true;
              }
            }
          }
        }
        return false;
      });
    }

    Object.keys(queryParams).forEach(key => {
      // Don't take into account JSONP query parameters
      // jQuery adds a '_' query parameter too
      if (key !== 'callback' && key !== '_') {
        // Always use an array, in case req.query is an array
        const arr = [].concat(queryParams[key]);

        table = table.filter(element => {
          return arr
            .map(value => {
              const isDifferent = /_ne$/.test(key);
              const isRange = /_lte$/.test(key) || /_gte$/.test(key);
              const isLike = /_like$/.test(key);
              const path = key.replace(/(_lte|_gte|_ne|_like)$/, '');
              // get item value based on path
              // i.e post.title -> 'foo'
              const elementValue = _.get(element, path);

              // Prevent toString() failing on undefined or null values
              if (elementValue === undefined || elementValue === null) {
                return null;
              }

              if (isRange) {
                const isLowerThan = /_gte$/.test(key);

                return isLowerThan ? value <= elementValue : value >= elementValue;
              } else if (isDifferent) {
                return value !== elementValue.toString();
              } else if (isLike) {
                return new RegExp(value, 'i').test(elementValue.toString());
              } else {
                return value === elementValue.toString();
              }
            })
            .reduce((a, b) => {
              return a || b;
            });
        });
      }
    });

    if (_sort) {
      const _sortSet = _sort.split(',');
      const _orderSet = (_order || '').split(',').map(s => {
        return s.toLowerCase() === 'ascend'
          ? 'asc'
          : s.toLowerCase() === 'descend'
          ? 'desc'
          : s.toLowerCase();
      });
      table = table.orderBy(_sortSet, _orderSet);
    }

    if (_page) {
      _page = parseInt(_page, 10);
      _page = _page >= 1 ? _page : 1;
      _limit = parseInt(_limit, 10) || 10;
      result = this.getPage(table.value(), _page, _limit).items;
    } else {
      result = table.value();
    }

    result = _.chain(result).cloneDeep();

    return {
      status: 'ok',
      data: result.value(),
      headers: new Headers({ 'x-total-count': table.size() }),
    };
  };

  getPage = (array, page, perPage) => {
    const obj = {};
    const start = (page - 1) * perPage;
    const end = page * perPage;

    obj.items = array.slice(start, end);
    if (obj.items.length === 0) {
      return obj;
    }

    if (page > 1) {
      obj.prev = page - 1;
    }

    if (end < array.length) {
      obj.next = page + 1;
    }

    if (obj.items.length !== array.length) {
      obj.current = page;
      obj.first = 1;
      obj.last = Math.ceil(array.length / perPage);
    }

    return obj;
  };

  processUrl = (url, options) => {
    // GET /users
    // GET /users/1
    // POST /users
    // PUT /users/1
    // DELETE /users/1
    const splitUrlForQuery = url.replace(`${API_URL}/`, '').split('?');
    let urlWithoutQuery = '';
    let queryParams = '';
    if (splitUrlForQuery.length === 2) {
      urlWithoutQuery = splitUrlForQuery[0];
      queryParams = splitUrlForQuery[1];
    } else {
      urlWithoutQuery = splitUrlForQuery[0];
      queryParams = '';
    }
    const splitUrl = urlWithoutQuery.split('/');
    let dbName = '';
    let action = '';
    let recordId = 0;
    if (splitUrl[0] === 'api') {
      dbName = splitUrl[1];
      action = splitUrl[2];
    } else {
      dbName = splitUrl[0];
      action = splitUrl[1];
    }
    // if action is number then determine action based on method

    if (action && !isNaN(action)) {
      recordId = action;
      switch (options.method) {
        case 'PUT':
          action = 'updateItem';
          break;
        case 'DELETE':
          action = 'deleteItem';
          break;
        default:
          action = 'readItem';
          break;
      }
    } else if (!action && options.method === 'POST') {
      action = 'createItem';
    } else if (!action) {
      action = 'list';
    }

    if (typeof this[action] === 'undefined') {
      throw new Error(`Action [${action}] not defined in mock data reader class`);
    }

    const response = this[action].call(this, dbName, {
      ...options,
      queryParams,
      recordId,
    });

    return response;
  };

  process = (url, options) => {
    const response = this.processUrl(url, options);
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        response.status === 'ok' ? resolve(response) : reject(response);
      }, 1000);
    });
    return p;
  };
}

const dataReader = new MockDataReader();
export default dataReader;
