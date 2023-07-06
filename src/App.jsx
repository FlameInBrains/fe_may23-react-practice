/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, Fragment } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategoryById(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId)
  || null;
}

function getUserByOwnerId(ownerId) {
  return usersFromServer.find(user => user.id === ownerId) || null;
}

function getFilteredByOwner(goods, { owner, query }) {
  let preparedProducts = goods.filter(good => good.owner.name === owner);

  if (owner === 'All') {
    preparedProducts = [...goods];
  }

  if (query) {
    return preparedProducts.filter(good => good.name
      .toLowerCase()
      .includes(query.toLowerCase()));
  }

  return preparedProducts;
}

const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId),
  owner: getUserByOwnerId(getCategoryById(product.categoryId).ownerId),
}));

export const App = () => {
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('All');
  const visibleProducts = getFilteredByOwner(products, { owner, query });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setOwner('All')}
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(null, { 'is-active': owner === 'All' })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => setOwner(user.name)}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames(null,
                    { 'is-active': owner === user.name })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  value={query}
                  onChange={
                    (event) => {
                      setQuery(event.target.value);
                    }
                  }
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {
                    query
                    && (
                      <button
                        data-cy="ClearButton"
                        onClick={() => {
                          setQuery('');
                        }}
                        type="button"
                        className="delete"
                      />
                    )
                }
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                onClick={() => {
                  setOwner('All');
                  setQuery('');
                }}
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  { visibleProducts.map(product => (
                    <Fragment key={product.id}>
                      <tr data-cy="Product">
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {product.id}
                        </td>

                        <td data-cy="ProductName">{product.name}</td>
                        <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={classNames('has-text-link',
                            { 'has-text-danger': product.owner.sex === 'f' })}
                        >
                          {product.owner.name}
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
