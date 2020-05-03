
import FilmCardComponent from "../components/film-card";
import FilmDetailsComponent from "../components/film-details";
import {isEscEvent} from "../utils/common";
import {render, remove, append, RenderPosition, replace} from "../utils/render";
import FilmCommentsComponent from "../components/comments";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._filmCommentsComponent = null;

    this._onPopupOpenClick = this._onPopupOpenClick.bind(this);
    this._onPopupCloseEscPress = this._onPopupCloseEscPress.bind(this);
    this._closePopup = this._closePopup.bind(this);


    this._film = null;
  }

  render(film) {
    this._film = film;

    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);
    this._filmCommentsComponent = new FilmCommentsComponent(film.comments);

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.setClickHandler(this._onPopupOpenClick);


    this._filmCardComponent.setWatchListButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = Object.assign({}, film);
      newFilm[`user_details`][`watchlist`] = !film[`user_details`][`watchlist`];

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setHistoryButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = Object.assign({}, film);
      newFilm[`user_details`][`already_watched`] = !film[`user_details`][`already_watched`];

      this._onDataChange(this, film, newFilm);
    });

    this._filmCardComponent.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = Object.assign({}, film);
      newFilm[`user_details`][`favorite`] = !film[`user_details`][`favorite`];

      this._onDataChange(this, film, newFilm);
    });

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmCommentsComponent);
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._onPopupCloseEscPress);
  }


  _closePopup() {
    // this._filmDetailsComponent.reset();
    // this._filmCommentsComponent.reset();
    this._mode = Mode.DEFAULT;

    remove(this._filmDetailsComponent);
    document.querySelector(`body`).classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._onPopupCloseEscPress);

    render(this._film);
  }

  _onPopupCloseEscPress(evt) {
    isEscEvent(evt, this._closePopup);
  }

  _onPopupOpenClick(evt) {
    const target = evt.target;

    if (target && target.className === `film-card__title` || target.className === `film-card__poster` || target.className === `film-card__comments`) {

      this._onViewChange();
      append(this._container, this._filmDetailsComponent);

      append(this._container.querySelector(`.film-details__inner`), this._filmCommentsComponent);

      document.querySelector(`body`).classList.add(`hide-overflow`);
      this._mode = Mode.EDIT;

      document.addEventListener(`keydown`, this._onPopupCloseEscPress);

      this._filmDetailsComponent.setPopupCloseClickHandler(this._closePopup);
    }
  }

}

