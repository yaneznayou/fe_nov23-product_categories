/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getProductCategory(categId) {
  return categoriesFromServer.find(categor => categor.id === categId) || null;
}

function getProductUser(userId) {
  return usersFromServer.find(user => user.id === userId) || null;
}

function getPrepareProducts(products, { sortField, query, selectedUser }) {
  let prepareProducts = [...products];

  if (selectedUser) {
    prepareProducts = prepareProducts.filter(
      product => product.owner.id === selectedUser,
    );
  }

  if (query) {
    prepareProducts = prepareProducts.filter(
      product => product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return prepareProducts;
}

export const productsRaw = productsFromServer.map(product => ({
  ...product,
  category: getProductCategory(product.categoryId),
}));

export const products = productsRaw.map(product => ({
  ...product,
  owner: getProductUser(product.category.ownerId),
}));

export const App = () => {
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleUserFilter = (userId) => {
    setSelectedUser(userId);
  };

  const handleResetFilters = () => {
    setSelectedUser(null);
    setSearchQuery('');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterProducts = getPrepareProducts(products, {
    sortField: 'sortField',
    query: searchQuery,
    selectedUser,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => setSelectedUser(null)}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  onClick={() => handleUserFilter(user.id)}
                  className={selectedUser === user.id ? 'is-active' : ''}
                  data-cy="FilterUser"
                  href="#/"
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={handleSearchInputChange}
                  value={searchQuery}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery.length > 0
                && (
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    onClick={() => setSearchQuery('')}
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
                )}

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

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                onClick={() => {
                  handleResetFilters();
                }}
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filterProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

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
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
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
              {filterProducts.map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={product.owner.sex === 'f'
                      ? 'has-text-danger'
                      : 'has-text-link'}
                  >
                    {product.owner.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
