import * as model from './model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import { getSearchResultsPage } from './model';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //Mark search recipe
    resultsView.update(getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    //controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    //render results
    resultsView.render(getSearchResultsPage());
    //Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};
const controlPagination = function (goToPage) {
  //Render New Results
  resultsView.render(getSearchResultsPage(goToPage));
  //Render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //add/remove bm
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    //fetch new recipe
    await model.uploadRecipe(newRecipe);
    //render added recipe
    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    //success message
    addRecipeView.renderMessage();
    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close modal
    setTimeout(() => {
      addRecipeView.render(model.state.recipe);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😫', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
