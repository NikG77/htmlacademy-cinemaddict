import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filter, isMain) => {
  const {name, count, isActive} = filter;
  return (
    `<a href="#${name.toLowerCase().split(` `, 1)}" data-filter="${name.toLowerCase().split(` `, 1)}"class="main-navigation__item
    ${isActive ? `main-navigation__item--active` : ``}">
    ${name} ${isMain ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterName = evt.target.dataset.filter;
      // if (this._currentFilterName === filterName) {
      //   console.log(`совпали фильтры`, this._currentFilterName, filterName);
      //   return;
      // }
      // console.log(`не совпали фильтры`, this._currentFilterName, filterName);
      // this._currentFilterName = filterName;

      handler(filterName);
    });
  }

}
