const { nanoid } = require('nanoid');
const books = require('./books');

// Menambahkan buku
const addBooksHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };
  // jika nama tidak ada atau undefined buku tidak tersimpan dalam array books
  if (name === undefined) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    );
    response.code(400);
    return response;
  }

  // jika readPage lebih besar dari pageCount buku tidak tersimpan dalam array books
  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    );
    response.code(400);
    return response;
  }
  // selain dari ketentuan diatas buku masuk dan tersimpan dalam array books
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
// Menampilkan semua buku yang ada dalam array books (id,name,publisher)
const getAllBooksHandler = (request, h) => {
  const { name, finished, reading } = request.query;

  if (name) {
    const filteredBooks = books.filter(book => { return book.name.toLowerCase().includes(name.toLowerCase()) });
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
        })
        response.code(200)
        return response
    }
    else if (reading) {
        const filteredBooks = books.filter(book => Number(book.reading) === Number(reading))
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooks.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }

    else if (finished) {
        const filteredBooks = books.filter(book => Number(book.finished) === Number(finished))
        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooks.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
    else {
        const response = h.response({
            status: 'success',
            data: {
                books: books.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        })
        response.code(200)
        return response
    }
};
//menampilkan buku berdasarkan parameter yang dimasukan
const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        })
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};


const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage } = request.payload;
    const reading = false;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    } if (readPage > pageCount) {
        const response = h.response(
            {
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            }
        );
        response.code(400);
        return response;
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
//Melakukan delete buku berdasarkan parameter yang dimasukan
const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,

};