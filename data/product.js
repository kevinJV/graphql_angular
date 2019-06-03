// ecma script

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'graphql'
})

connection.connect()



const addProduct =  (name, description) => {
    return  new Promise((resolve, reject) => {
        query = `INSERT INTO products (name, description) VALUES (?, ?)`
        connection.query(query, [name, description], async function (error, result, fields) {
            if (error) {
                console.log("Error")
                console.log(error)
                reject(error);
            }

            console.log("Result:")
            console.log(result)
            console.log(result.insertId)
            data = await getProduct(result.insertId);
            console.log(data)
            resolve(data);
        })
    })
};

const getProduct = async (id) => {
    return await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM products WHERE id = ?", [id], function (error, result, fields) {
            if (error)
                reject(error);

            console.log(JSON.parse(JSON.stringify(result[0])))
            resolve(JSON.parse(JSON.stringify(result[0])));
        })
    })
}

const getProducts = async () => {
    return await new Promise((resolve, reject) => {
        connection.query("Select * from products", function (error, result, fields) {
            if (error)
                reject(error);
            console.log("Adentro de get normal")
            console.log(result)
            console.log("Final de get normal")
            resolve(result);
        })
    })
}

const removeProduct = async (id) => {
    return await new Promise((resolve, reject) => {
        query = `DELETE FROM products WHERE id = ?`
        connection.query(query, [id], function (error, result, fields) {
            if (error) {
                console.log("Error")
                console.log(error)
                reject(error);
            }

            resolve(result);
        })
    })
}

const editProduct = async (id, name, description) => {
    return await new Promise((resolve, reject) => {
        query = `UPDATE products SET name = ?, description = ? WHERE id = ?`
        connection.query(query, [name, description, id], async function (error, result, fields) {
            if (error) {
                console.log("Error")
                console.log(error)
                reject(error);
            }

            console.log("Producto modificado: ")
            data = await getProduct(id);
            console.log(data)
            resolve(data);
        })
    })
}

module.exports = {
    getProducts,
    addProduct,
    removeProduct,
    editProduct
}

//connection.end()

// // ecma script
// let products = [
//     {
//         id: 1,
//         name: "coca cola",
//         description: "Bebida gaseosa"
//     },
//     {
//         id: 2,
//         name: "tequila",
//         description: "Alejar de augusto"
//     },
//     {
//         id: 3,
//         name: "toanaya",
//         description: "Alejar de pedro"
//     }
// ];

// const addProduct = (name, description) => {
//     const id = products[products.length - 1].id + 1;
//     const newProduct = { id, name, description };
//     products = [...products, newProduct];
//     return { ...newProduct }

// };

// const getProducts = () => {
//     return products
// }

// const removeProduct = (id) => {    
//     const product = products.find(p => p.id === id)
//     const index = products.indexOf(product, 0)
//     products.splice(index, 1)
//     console.log(products)
//     return products;
// }

// const editProduct = (id, name, description) => {
//     const product = products.find(p => p.id === id)
//     const index = products.indexOf(product, 0)

//     products[index].name = name
//     products[index].description = description

//     return products[index];
// }

// module.exports = {
//     getProducts,
//     addProduct,
//     removeProduct,
//     editProduct
// }