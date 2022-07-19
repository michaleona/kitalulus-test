import { useState, useEffect, Fragment } from "react";
import {
  FilterIcon,
  PencilAltIcon,
  InformationCircleIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";

export default function index() {
  const [books, setBooks] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [record, setRecord] = useState();
  const [description, setDescription] = useState();
  const [editedRecord, setEditedRecord] = useState();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    setLoading(true);
    fetch("https://andywiranata-42555.firebaseio.com/test-frontend/items.json")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  };

  const editBook = (index, book) => {
    setEdit(true);
    setRecord(index);
    setEditedRecord(book);
  };

  const saveBook = async (index) => {
    const response = await fetch(
      `https://andywiranata-42555.firebaseio.com/test-frontend/items/${index}.json`,
      {
        method: "PUT",
        body: JSON.stringify(editedRecord),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.json();
    loadBooks();
    setEdit(false);
    setRecord(index);
  };

  const viewDescription = (bookDescription) => {
    setDescription(bookDescription);
    setOpen(true);
  };

  const handleEditRecord = (e) => {
    setEditedRecord({ ...editedRecord, [e.target.id]: e.target.value });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!books) return <p>No profile data</p>;

  return (
    <Fragment>
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="sm:flex sm:items-center">
          <div className="mt-4 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <FilterIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              Filter
            </button>
          </div>
        </div>
        <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Views
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Genre
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Description
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td></td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  <input
                    type="text"
                    name="title-search"
                    id="title-search"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search title"
                  />
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  <input
                    type="text"
                    name="genre-search"
                    id="genre-search"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search genre"
                  />
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"></td>
              </tr>
              {books.map((book, index) => (
                <tr key={book.index}>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {index + 1}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {!isEdit || (isEdit && record !== index) ? (
                      <span>{book.title}</span>
                    ) : (
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Input title"
                        value={editedRecord.title}
                        onChange={(e) => handleEditRecord(e)}
                      />
                    )}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    {!isEdit || (isEdit && record !== index) ? (
                      <span>{book.views}</span>
                    ) : (
                      <input
                        type="number"
                        name="views"
                        id="views"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Input views"
                        min="0"
                        value={editedRecord.views}
                        onChange={(e) => handleEditRecord(e)}
                      />
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {!isEdit || (isEdit && record !== index) ? (
                      <span>{book.genre}</span>
                    ) : (
                      <input
                        type="text"
                        name="genre"
                        id="genre"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Input genre"
                        value={editedRecord.genre}
                        onChange={(e) => handleEditRecord(e)}
                      />
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 flex space-x-2 items-center">
                    {!isEdit || (isEdit && record !== index) ? (
                      <Fragment>
                        <span className="max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                          {book.descriptions}{" "}
                        </span>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-gray-600"
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
                      <input
                        type="text"
                        name="descriptions"
                        id="descriptions"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => editBook(index, book)}
                      >
                        <PencilAltIcon className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">, {index}</span>
                      </a>
                    ) : (
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => saveBook(index)}
                      >
                        <CheckIcon
                          className="h-4 w-4 text-green-600"
                          aria-hidden="true"
                        />
                        <span className="sr-only">, {index}</span>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
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
                <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
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
