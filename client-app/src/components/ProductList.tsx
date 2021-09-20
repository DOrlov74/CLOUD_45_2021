import React, { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Header, Image } from "semantic-ui-react";
import api from "../app/api";
import { Product } from "../models/product";
import { SalesDetail } from "../models/salesdetail";
import { CartContext } from "./CartProvider";
import { UserContext } from "./UserProvider";

export default function ProductList() {
    const userCtx=React.useContext(UserContext);
    const cartCtx=React.useContext(CartContext);
    const [target, setTarget] = useState('');
    const [products, setProducts]=useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct]=useState<Product|undefined>(undefined);
    const [submiting, setSubmiting]=useState(false);
    const newSalesDetail={
        Id: '',
        SaleID: '',
        Seq: '',
        Product: '',
        Quantity: 0,
        UnitPrice: null,
        LineTotal: 0,
    }
    const [activeSalesDetail, setActiveSalesDetail]=useState<SalesDetail>(newSalesDetail);
    useEffect(() => {
        api.Products.list().then(response => {
          console.log(response);
          setProducts(response);
        })
      }, [])
    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id:string){
        setTarget(e.currentTarget.name);
        setSubmiting(true);
        api.Products.delete(id).then(()=>{
        setProducts([...products.filter(s=>s.ProductId !== id)]);
        setSubmiting(false);
        });
    }
    function handleAddToCart(e: SyntheticEvent<HTMLButtonElement>, product:Product){
        setTarget(e.currentTarget.name);
        setSubmiting(true);
        setSelectedProduct(product);
        const activeSale = cartCtx.activeSale;
        let salesDetail = activeSalesDetail;
        if(activeSale?.SalesDetails!==[] 
            && activeSale?.SalesDetails.some(d=>d.Product === product.ProductId)){
            const tempSalesDetail = activeSale.SalesDetails.find(d=>d.Product === product.ProductId);
            if(tempSalesDetail!==undefined && salesDetail.UnitPrice!==null){
                salesDetail = tempSalesDetail;
                salesDetail.Quantity+=1;
                salesDetail.LineTotal+=salesDetail.UnitPrice ? salesDetail.UnitPrice : 0;
            }
        } else {  
            salesDetail.SaleID = activeSale !== null ? activeSale.Id : '';
            salesDetail.Product = product.ProductId;
            salesDetail.UnitPrice = product.UnitPrice;
            salesDetail.Quantity = 1;
            salesDetail.LineTotal = product.UnitPrice ? product.UnitPrice : 0;
        }
        updateSalesDetail(salesDetail);
        setActiveSalesDetail(salesDetail);
        setSubmiting(false);
    }
    function addSalesDetail(salesDetail: SalesDetail){
        return api.SalesDetails.create(salesDetail)
    }
    function updateSalesDetail(salesDetail: SalesDetail){
        return api.SalesDetails.update(salesDetail)
    }
      
    return(
        <>
            <Header as='h1'>The products</Header>
            <Card.Group>
                {products.map(product => (
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
                            <p>Price: {product.UnitPrice} per {product.QuantityPerUnit} {product.UnitMeasure}</p>
                        </Card.Meta>
                        <Card.Description>
                        <p>The product is <strong>{product.Discontinued ? "discontinued" : "available" }</strong></p>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        {userCtx.user?.roles.some((r)=>r.RoleName === "admin")?
                            <div className='ui three buttons'>
                            <Button basic color='yellow'>
                                View Stocks
                            </Button>
                            <Button as={Link} to={`/editproduct/${product.ProductId}`} basic color='green'>
                                Edit
                            </Button>
                            <Button name={product.ProductId} loading={submiting && target === product.ProductId} onClick={(e)=>handleDeleteProduct(e,product.ProductId)} basic color='red'>
                                Delete
                            </Button>
                            </div>:
                            <div className='ui two buttons'>
                            <Button basic color='yellow'>
                                View Stocks
                            </Button>
                            <Button name={product.ProductId} loading={submiting && target === product.ProductId} onClick={(e)=>handleAddToCart(e, product)} basic color='green'>
                                Add to cart
                            </Button>
                            </div>
                        }
                    </Card.Content>
                    </Card>
                ))}
            </Card.Group>
        </>
)}