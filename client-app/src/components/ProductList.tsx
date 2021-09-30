import React, { SyntheticEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Card, Divider, Grid, Header, Icon, Label } from "semantic-ui-react";
import api from "../app/api";
import { Product } from "../models/product";
import { SalesDetail } from "../models/salesdetail";
import { CartContext } from "./CartProvider";
import { UserContext } from "./UserProvider";

export default function ProductList() {
    const userCtx=React.useContext(UserContext);
    const cartCtx=React.useContext(CartContext);
    const [target, setTarget] = useState('');
    const [selectedProduct, setSelectedProduct]=useState<Product|undefined>(undefined);
    const [submiting, setSubmiting]=useState(false);
    const newSalesDetail={
        SalesDetailId: '',
        SaleID: '',
        Seq: 0,
        Product: '',
        Quantity: 0,
        UnitPrice: 0,
        LineTotal: 0,
    }

    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id:string){
        setTarget(e.currentTarget.name);
        setSubmiting(true);
        api.Products.delete(id).then(()=>{
        cartCtx.setProducts([...cartCtx.products.filter(s=>s.ProductId !== id)]);
        setSubmiting(false);
        });
    }
    function handleAddToCart(e: SyntheticEvent<HTMLButtonElement>, product:Product){
        setTarget(e.currentTarget.name);
        setSubmiting(true);
        setSelectedProduct(product);
        const activeSalesDetails = cartCtx.activeSalesDetails;
        if(activeSalesDetails !==[] 
            && activeSalesDetails.some(d=>d.Product === product.ProductId)){
            const tempSalesDetail = activeSalesDetails.find(d=>d.Product === product.ProductId);
            if(tempSalesDetail!==undefined && tempSalesDetail.UnitPrice!==null){
                tempSalesDetail.Quantity+=1;
                tempSalesDetail.LineTotal+=tempSalesDetail.UnitPrice ? tempSalesDetail.UnitPrice : 0;
                updateSalesDetail(tempSalesDetail);
                cartCtx.setActiveSalesDetails([...activeSalesDetails.filter(d => d.SalesDetailId !== tempSalesDetail.SalesDetailId), tempSalesDetail]);
            }
        } else { 
            const tempSalesDetail = newSalesDetail; 
            tempSalesDetail.SaleID = (cartCtx.activeSale !== null ? cartCtx.activeSale.SaleId : '');
            tempSalesDetail.Product = product.ProductId;
            tempSalesDetail.UnitPrice = product.UnitPrice ? product.UnitPrice : 0;
            tempSalesDetail.Quantity = 1;
            tempSalesDetail.LineTotal = product.UnitPrice ? product.UnitPrice : 0;
            addSalesDetail(tempSalesDetail);
        }
        setSubmiting(false);
    }
    function addSalesDetail(salesDetail: SalesDetail){
        api.SalesDetails.create(salesDetail).then(response => {
            if(response!==null) cartCtx.setActiveSalesDetails([...cartCtx.activeSalesDetails, response]);
        }).catch((err)=>{
            console.log(err);
        });
        return 
    }
    function updateSalesDetail(salesDetail: SalesDetail){
        return api.SalesDetails.update(salesDetail)
    }
      
    return(
        <>
            <Header as='h1'>Our products</Header>
            <Card.Group>
                {cartCtx.products.map(product => (
                    <Card key={product.ProductId}>
                    <Card.Content>
                        {/* <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                        /> */}
                        <Card.Header>{product.ProductName}</Card.Header>
                        <Card.Meta>
                            <p>Barcode: {product.Barcode}</p>
                            <p>Price: {product.UnitPrice}&euro; per {product.QuantityPerUnit} {product.UnitMeasure}</p>
                        </Card.Meta>
                        <Card.Description>
                        <p>The product is <strong>{product.Discontinued ? "discontinued" : "available" }</strong></p>
                            <Grid>
                                <Grid.Column floated='left' width={8}>
                                    <Label>{cartCtx.families.find(f=>f.FamilyId === product.FamilyId)?.FamilyName}</Label>
                                </Grid.Column>
                                <Grid.Column floated='right' width={7}>
                                    {cartCtx.activeSalesDetails.some(d=>d.Product === product.ProductId)?
                                    <Label color='orange'>In cart: {cartCtx.activeSalesDetails.find(d=>d.Product === product.ProductId)?.Quantity} {product.UnitMeasure}</Label>
                                    :<></>
                                    }
                                </Grid.Column>
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {userCtx.userRoles.some((r)=>r.Name === "admin")?
                            <div className='ui three buttons'>
                            <Button color='yellow'>
                                View Stocks
                            </Button>
                            <Button as={Link} to={`/editproduct/${product.ProductId}`} color='green'>
                                Edit
                            </Button>
                            <Button name={product.ProductId} loading={submiting && target === product.ProductId} onClick={(e)=>handleDeleteProduct(e,product.ProductId)} color='red'>
                                Delete
                            </Button>
                            </div>:
                            <div className='ui two buttons'>
                            <Button color='yellow'>
                                View Stocks
                            </Button>
                            {(userCtx.user != null)?
                            <Button disabled={product.Discontinued} name={product.ProductId} loading={submiting && target === product.ProductId} onClick={(e)=>handleAddToCart(e, product)} color={product.Discontinued?'grey':'green'}>
                                Add to cart
                            </Button>:
                            <Button as={NavLink} to='/login' name='Login' color='green'>
                                Please login
                            </Button>
                            }
                            </div>
                        }
                    </Card.Content>
                    </Card>
                ))}
            </Card.Group>
            {userCtx.userRoles.some((r)=>r.Name === "admin")?
            <>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='edit outline' />
                    New Product
                </Header>
            </Divider>
            <Card.Group centered>
                <Button as={NavLink} to='/newproduct' positive content='Create Product'/>
            </Card.Group>
            </>:<></>
            }
        </>
)}