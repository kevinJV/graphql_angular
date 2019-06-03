import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FormsModule, FormBuilder, Validator, FormGroup, Validators } from '@angular/forms';

import * as Query from './query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';

  editando = false;
  id: number;

  products: any = [];
  angForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.getProducts();
  }

  createForm() {
    this.angForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    })
  }

  getProducts() {
    console.log("Obteniendo productos..........")
    this.apollo.watchQuery({ query: Query.Products }).valueChanges.subscribe(response => {
      console.log(response);
      this.products = response.data['products'];
    });
  }

  createProduct() {
    //this.apollo.watchQuery({ query: Query.createProduct })
    console.log("Valores a meter: " + this.angForm.value.name + " || " + this.angForm.value.description)
    this.apollo.mutate({
      mutation: Query.createProduct,
      variables: {
        name: this.angForm.get('name').value,
        description: this.angForm.get('description').value
      },
      update: (proxy, { data: { createProduct } }) => {
        const data: any = proxy.readQuery({ query: Query.Products })        
        console.log("data")
        console.log(data)
        console.log("createProduct")
        console.log(createProduct)
        this.products.push(createProduct)

        proxy.writeQuery({ query: Query.Products, data })
      }
    }).subscribe(({ data }) => {
      console.log("data de suscribe")
      console.log(data)
    }, (error) => {
      console.log("error", error)
    })
    this.angForm.get('name').setValue("")
    this.angForm.get('description').setValue("")
  }

  setEditProduct(item: any) {
    console.log(item)
    this.angForm.get('name').setValue(item.name)
    this.angForm.get('description').setValue(item.description)
    this.id = item.id
    this.editando = true;
  }

  editProduct() {
    console.log(this.angForm.value.name + " || " + this.angForm.value.description)

    this.apollo.mutate({
      mutation: Query.updateProduct,
      variables: {
        id: this.id,
        name: this.angForm.get('name').value,
        description: this.angForm.get('description').value
      },
      update: (proxy, { data: { updateProduct } }) => {
        const data: any = proxy.readQuery({ query: Query.Products })

        console.log(data, updateProduct)

        const foundIndex = this.products.findIndex(x => x.id == this.id)
        console.log(updateProduct.updateProduct)
        this.products[foundIndex] = updateProduct.updateProduct
        proxy.writeQuery({ query: Query.Products, data })
      }
    }).subscribe(({ data }) => {
      console.log(data)
    }, (error) => {
      console.log("error", error)
    })
    this.angForm.get('name').setValue("")
    this.angForm.get('description').setValue("")
    this.editando = false;
  }

  deleteProduct(id) {
    this.apollo.mutate({
      mutation: Query.deleteProduct,
      variables: {
        id: id
      },
      update: (proxy, { data: { deleteProduct } }) => {
        const data: any = proxy.readQuery({ query: Query.Products })

        console.log(data, deleteProduct)

        const foundIndex = this.products.findIndex(x => x.id == this.id)
        this.products.splice(foundIndex, 1)

        proxy.writeQuery({ query: Query.Products, data })
      }
    }).subscribe(({ data }) => {
      console.log(data)
    }, (error) => {
      console.log("error", error)
    })
    this.angForm.get('name').setValue("")
    this.angForm.get('description').setValue("")
    this.editando = false;
  }


}
