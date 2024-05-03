import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return
            const goToPage = +btn.dataset.goto
            handler(goToPage)
        })
    }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    // Page 1 , (there are  more)
    if (curPage === 1 && numPages > 1) {
      return this._generateBtn(curPage + 1, ['next', 'right'] )
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateBtn(curPage - 1, ['prev', 'left'] )

    }
    //Other pages

    if (curPage < numPages && curPage > 1) {
      return this._generateBtn(curPage - 1, ['prev', 'left'] )
          + this._generateBtn(curPage + 1, ['next', 'right'] )
    }

    return '';
  }
  _generateBtn(curPage, way){
      return `<button data-goto="${curPage}" class="btn--inline pagination__btn--${way[0]}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${way[1]}"></use>
            </svg>
            <span>Page ${curPage}</span>
          </button>`
  }
}
export default new PaginationView();
