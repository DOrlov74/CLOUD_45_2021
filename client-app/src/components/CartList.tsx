import React, { useState, MouseEvent, useEffect } from "react";
import { Header, Grid, Label, Segment, Button, Card } from "semantic-ui-react";
import api from "../app/api";
import { SalesDetail } from "../models/salesdetail";
import { CartContext } from "./CartProvider";
import { UserContext } from "./UserProvider";

export default function CartList(){
    const cartCtx=React.useContext(CartContext);
    const userCtx=React.useContext(UserContext);
    const [submiting, setSubmiting]=useState(false);
    const [totalProducts, setTotalProducts]=useState<number>(0);
    const [totalPrice, setTotalPrice]=useState<number>(0);
    // useEffect(()=>{
    //     cartCtx.fillUserSales();
    // }, [userCtx.user])

    // useEffect(()=>{
    //     cartCtx.fillCartProducts();
    //     cartCtx.fillActiveSalesDetails();
    // }, [cartCtx.activeSale])

    // useEffect(()=>{
    //     cartCtx.fillUserSalesDetails();        
    // }, [cartCtx.userSales])


    useEffect(()=>{
        let price = 0;
        cartCtx.activeSalesDetails.map(d=>{
            price += d.LineTotal;
        });
        setTotalPrice(price);
        setTotalProducts(cartCtx.cartProducts.length);
    }, [cartCtx.activeSalesDetails, cartCtx.cartProducts])

    function addProduct(event: MouseEvent){
        const target=event.target as HTMLButtonElement;
        const activeSalesDetails = cartCtx.activeSalesDetails;
        const salesDetail = activeSalesDetails.find(d=>d.Product === target.value);
        if(salesDetail !== undefined && salesDetail.UnitPrice !== 0){
            salesDetail.Quantity += 1;
            salesDetail.LineTotal += salesDetail.UnitPrice;
            updateSalesDetail(salesDetail);
            cartCtx.setActiveSalesDetails([...activeSalesDetails.filter(d => d.SalesDetailId !== salesDetail?.SalesDetailId), salesDetail]);
            setSubmiting(false);
        }
    }

    function removeProduct(event: MouseEvent){
        const target=event.target as HTMLButtonElement;
        const activeSalesDetails = cartCtx.activeSalesDetails;
        const salesDetail = activeSalesDetails.find(d=>d.Product === target.value);
        if(salesDetail !== undefined && salesDetail.UnitPrice !== 0 && salesDetail.Quantity > 0){
            salesDetail.Quantity -= 1;
            salesDetail.LineTotal -= salesDetail.UnitPrice;
            updateSalesDetail(salesDetail);
            cartCtx.setActiveSalesDetails([...activeSalesDetails.filter(d => d.SalesDetailId !== salesDetail?.SalesDetailId), salesDetail]);
            setSubmiting(false);
        }
    }

    function updateSalesDetail(salesDetail: SalesDetail){
        setSubmiting(true);
        return api.SalesDetails.update(salesDetail)
    }

    return(
        <>
        {totalProducts>0?
        <>
        <Header as='h1'>Your Cart</Header>
        <Grid >
            <Grid.Column width={10}>
                    {cartCtx.cartProducts.map(product=>{
                        return(
                            <Card key={product.ProductId} fluid>
                                <Card.Content>
                                <Card.Header as='h2'>{product.ProductName}</Card.Header>
                                <Card.Meta>    <p>Barcode: {product.Barcode}</p></Card.Meta>
                                <Card.Description>
                                    <Grid>
                                        <Grid.Column floated='left' width={10}>
                                            <p>Price: {product.UnitPrice}&euro; per {product.QuantityPerUnit} {product.UnitMeasure}</p>
                                        </Grid.Column>
                                        <Grid.Column floated='right' width={6}>
                                            <strong>Total: {cartCtx.activeSalesDetails?.find(d=>d.Product === product.ProductId)?.LineTotal}&euro; </strong>
                                        </Grid.Column>
                                    </Grid>
                                        <Label>{cartCtx.families.find(f=>f.FamilyId === product.FamilyId)?.FamilyName}</Label>
                                        <Button.Group size='large' floated='right'>
                                            <Button loading={submiting} negative onClick={removeProduct} type='button' value={product.ProductId}>-</Button>
                                            <Button >{cartCtx.activeSalesDetails.find(d=>d.Product === product.ProductId)?.Quantity} {product.UnitMeasure}</Button>
                                            <Button loading={submiting} positive onClick={addProduct} type='button' value={product.ProductId}>+</Button>
                                        </Button.Group>
                                </Card.Description>
                                </Card.Content>
                            </Card>
                    )})}
            </Grid.Column>
            <Grid.Column width={6}>
                <Segment>
                    <Header as='h2'>Total:</Header>
                    <p>{totalProducts} units for {totalPrice}&euro;</p>
                </Segment>
            </Grid.Column>
        </Grid>
        </>:
        <Header as='h1'>Your Cart is empty</Header>}
        </>
    );
}