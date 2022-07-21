import { useState, useEffect, Fragment } from "react";
import {
  FilterIcon,
  PencilAltIcon,
  CheckIcon,
  XCircleIcon,
  XIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import NumberFormat from "react-number-format";

export default function index() {
  const [books, setBooks] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [record, setRecord] = useState();
  const [description, setDescription] = useState();
  const [editedRecord, setEditedRecord] = useState();
  const [isShowFilter, setShowFilter] = useState(false);
  const [titleSearch, setTitleSearch] = useState();
  const [genreSearch, setGenreSearch] = useState();
  const [bookTemporary, setBookTemporary] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    show &&
      setInterval(() => {
        setShow(false);
      }, 3000);
  }, [show]);

  useEffect(() => {
    if (bookTemporary && (titleSearch || genreSearch)) {
      let regexTitle = new RegExp(titleSearch, "gi");
      let regexGenre = new RegExp(genreSearch, "gi");
      let matchBook;
      if (titleSearch && genreSearch) {
        const filterByTitle = bookTemporary.filter((book) =>
          book.title.match(regexTitle)
        );
        const filterByGenre = filterByTitle.filter((book) =>
          book.genre.match(regexGenre)
        );
        matchBook = filterByGenre;
      } else if (titleSearch) {
        matchBook = bookTemporary.filter((book) =>
          book.title.match(regexTitle)
        );
      } else if (genreSearch) {
        matchBook = bookTemporary.filter((book) =>
          book.genre.match(regexGenre)
        );
      }
      setBooks(matchBook);
    } else {
      setBooks(bookTemporary);
    }
  }, [titleSearch, genreSearch]);

  const loadBooks = () => {
    setLoading(true);
    fetch("https://andywiranata-42555.firebaseio.com/test-frontend/items.json")
      .then((res) => res.json())
      .then((data) => {
        const booksWithId = data.map((book, index) => ({ ...book, id: index }));
        setBooks(booksWithId);
        setLoading(false);
      });
  };

  const editBook = (index, book) => {
    setEdit(true);
    setRecord(index);
    setEditedRecord(book);
  };

  const saveBook = async (id) => {
    const response = await fetch(
      `https://andywiranata-42555.firebaseio.com/test-frontend/items/${id}.json`,
      {
        method: "PUT",
        body: JSON.stringify(editedRecord),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.json();
    setShow(true);
    setShowFilter(false);
    setTitleSearch();
    setGenreSearch();
    loadBooks();
    setEdit(false);
  };

  const viewDescription = (bookDescription) => {
    setDescription(bookDescription);
    setOpen(true);
  };

  const handleEditRecord = (e) => {
    setEditedRecord({ ...editedRecord, [e.target.id]: e.target.value });
  };

  const filterBooks = () => {
    setShowFilter(!isShowFilter);
    setEdit(false);
    setTitleSearch();
    setGenreSearch();
  };

  useEffect(() => {
    if (isShowFilter) {
      setBookTemporary(books);
    } else {
      setBooks(bookTemporary);
      setBookTemporary(null);
    }
  }, [isShowFilter]);

  return (
    <Fragment>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div
          aria-live="assertive"
          className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
        >
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-6 w-6 text-green-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        Successfully saved!
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div className="sm:flex sm:items-center">
          <div className="mt-4 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 shadow-lg border-gray-300 text-sm rounded-full  bg-[#0F2027] text-gray-300 font-bold tracking-wide"
              onClick={() => filterBooks()}
            >
              {isShowFilter ? (
                <Fragment>
                  <XCircleIcon
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />{" "}
                  Close
                </Fragment>
              ) : (
                <Fragment>
                  <FilterIcon
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Filter
                </Fragment>
              )}
            </button>
          </div>
        </div>
        <div className="-mx-4 mt-8 overflow-hidden shadow-lg border-none sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#0F2027]">
              <tr className="text-gray-500">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-right text-sm sm:pl-6 w-12"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm lg:table-cell w-64"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm sm:table-cell w-32"
                >
                  Views
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left sm:table-cell text-sm w-64"
                >
                  Genre
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm">
                  Description
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-[#0F2027]">
              {isShowFilter && (
                <tr>
                  <td></td>
                  <td className=" px-3 py-4 text-sm text-gray-300">
                    <input
                      type="text"
                      name="title-search"
                      id="title-search"
                      className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                      placeholder="Search title"
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                    />
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"></td>
                  <td className="hidden px-3 py-4 text-sm text-gray-300 sm:table-cell">
                    <input
                      type="text"
                      name="genre-search"
                      id="genre-search"
                      className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                      placeholder="Search genre"
                      value={genreSearch}
                      onChange={(e) => setGenreSearch(e.target.value)}
                    />
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500"></td>
                  <td className="px-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                </tr>
              )}
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-gray-300 text-center p-8">
                    Loading ...
                  </td>
                </tr>
              ) : !books ? (
                <tr>
                  <td colSpan={6} className="text-gray-300 text-center p-8">
                    No books available
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
                  <tr key={book.index} className="font-semibold">
                    <td className="px-3 py-4 text-sm text-right text-gray-300 lg:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-300 lg:table-cell">
                      {!isEdit || (isEdit && record !== index) ? (
                        <span>{book.title}</span>
                      ) : (
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                          placeholder="Input title"
                          value={editedRecord.title}
                          onChange={(e) => handleEditRecord(e)}
                        />
                      )}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-right text-gray-300 sm:table-cell">
                      {!isEdit || (isEdit && record !== index) ? (
                        <span>
                          <NumberFormat
                            value={book.views}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </span>
                      ) : (
                        <input
                          type="number"
                          name="views"
                          id="views"
                          className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                          placeholder="Input views"
                          min="0"
                          value={editedRecord.views}
                          onChange={(e) => handleEditRecord(e)}
                        />
                      )}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-gray-300 sm:table-cell">
                      {!isEdit || (isEdit && record !== index) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wide bg-purple-100 text-purple-600">
                          {book.genre}
                        </span>
                      ) : (
                        <input
                          type="text"
                          name="genre"
                          id="genre"
                          className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                          placeholder="Input genre"
                          value={editedRecord.genre}
                          onChange={(e) => handleEditRecord(e)}
                        />
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-300 flex space-x-2 items-center w-24 sm:w-80">
                      {!isEdit || (isEdit && record !== index) ? (
                        <Fragment>
                          <span className="max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                            {book.descriptions}{" "}
                          </span>
                          <a
                            href="#"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => viewDescription(book.descriptions)}
                          >
                            <InformationCircleIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">, {book.id}</span>
                          </a>
                        </Fragment>
                      ) : (
                        <textarea
                          type="text"
                          name="descriptions"
                          id="descriptions"
                          className="block w-full sm:text-sm border-gray-600 border rounded-md p-2 bg-transparent"
                          placeholder="Input descriptions"
                          value={editedRecord.descriptions}
                          onChange={(e) => handleEditRecord(e)}
                        />
                      )}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {!isEdit || (isEdit && record !== index) ? (
                        <a
                          href="#"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => editBook(index, book)}
                        >
                          <PencilAltIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                          <span className="sr-only">, {index}</span>
                        </a>
                      ) : (
                        <a href="#" onClick={() => saveBook(book.id)}>
                          <CheckIcon
                            className="h-4 w-4 text-green-600"
                            aria-hidden="true"
                          />
                          <span className="sr-only">, {index}</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-[#0F2027] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-full border-2 border-gray-300 shadow-sm px-4 py-2 bg-transparent text-base font-bold text-gray-300 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
}
