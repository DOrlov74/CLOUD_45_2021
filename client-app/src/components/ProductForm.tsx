import React, { ChangeEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Grid, Header } from "semantic-ui-react";
import api from "../app/api";
import { Product } from "../models/product";

export default function ProductForm(){
    const history = useHistory();
    const {id} = useParams<{id: string}>();
    const initialState={
        ProductId: '',
        Barcode: '',
        ProductName: '',
        FamilyId: '',
        UnitMeasure: 'piece',
        QuantityPerUnit: 1,
        UnitPrice: null,
        Discontinued: false,
        Stocks: []
    }
    const [product, setProduct]=useState<Product>(initialState);
    const [submiting, setSubmiting]=useState(false);
    useEffect(()=>{
        if(id){
            api.Products.details(id).then(response => {
                if(response!==null) setProduct(response);
            }).catch((err)=>{
                console.log(err);
            });
        };
    }, [id])

    function handleSubmit(){
        editProduct(product);
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value}=event.target;
        setProduct({...product, [name]: value})
    }
    function toggleDiscontinued(){
        setProduct({...product, Discontinued: !product.Discontinued})
    }
    function editProduct(product: Product){
        setSubmiting(true);
        if (product.ProductId){
          api.Products.update(product).then(()=>{
            history.push('/product');
          })
        } else {
          api.Products.create(product).then(()=>{
            history.push('/product');
          })
        }
        setProduct(product);
        setSubmiting(false);   
    }
    function closeForm(){
        history.push('/product');
    }
    return(
        <>
            <Grid centered columns={2}>
                <Grid.Column>
                    <Header as='h2'>New store</Header>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input required placeholder='Product Name' value={product.ProductName} name='ProductName' onChange={handleInputChange}/>
                        <Form.Input placeholder='Barcode' value={product.Barcode} name='Barcode' onChange={handleInputChange}/>
                        <Form.Input placeholder='Product Price' value={product.UnitPrice} name='UnitPrice' onChange={handleInputChange}/>
                        <Form.Input placeholder='Unit Measure' value={product.UnitMeasure} name='UnitMeasure' onChange={handleInputChange}/>
                        <Form.Input placeholder='Quantity per Unit' value={product.QuantityPerUnit} name='QuantityPerUnit' onChange={handleInputChange}/>
                        <Form.Checkbox label='Discontinued' checked={product.Discontinued} name='Discontinued' onChange={toggleDiscontinued}/>
                        <Button loading={submiting} positive type='submit'>Submit</Button>
                        <Button onClick={closeForm} type='button'>Cancel</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        </>
    )
}