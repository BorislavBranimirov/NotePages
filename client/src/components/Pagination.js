import React from 'react';
import { useHistory } from 'react-router-dom';
import { updateQuery } from '../../utils/queryUtils';

function createPaginationListItems(currentPage, totalPages, onClick) {
    // keep the number odd, so that there are an equal number of buttons around current button
    const maxItems = 7;
    const diff = Math.floor(maxItems - 2) / 2;
    let pageBtns = [];
    let lastValue = null;

    for (let i = 1; i <= totalPages; i++) {
        if (i == 1 || i == totalPages || (i > currentPage - diff && i < currentPage + diff)) {
            if (pageBtns.length > 0 && i - lastValue > 1) {
                pageBtns.push(
                    <li key={i + 'empty'}>
                        <p className="pagination-empty">…</p>
                    </li>
                );
            }

            let btnClass = (i === currentPage) ? "pagination-btn pagination-btn-active" : "pagination-btn";
            pageBtns.push(
                <li key={i}>
                    <button className={btnClass} onClick={onClick} value={i}>
                        {i}
                    </button>
                </li>
            );
            lastValue = i;
        }
    }

    return pageBtns;
}

const Pagination = (props) => {
    const history = useHistory();

    const changePage = (event) => {
        const newQuery = updateQuery({ 'page': event.target.value });
        history.push('/notes' + newQuery);
    };

    let pageBtns = createPaginationListItems(props.currentPage.current, props.totalPages.current, changePage);

    // add one page if there are none in total
    if (props.totalPages.current === 0) {
        pageBtns.push(
            <li key="1">
                <button className="pagination-btn pagination-btn-active" onClick={changePage} value={1}>
                    {1}
                </button>
            </li>
        );
    }

    return (
        <ul className="pagination">
            {pageBtns}
        </ul>
    );
};

export default Pagination;