import './App.css'
import React, { useState, useEffect } from 'react';
import { Container , Form , Button } from 'react-bootstrap';
import axios from 'axios';
import Product from './components/Product';
import moment from 'moment';

function App() {
  //Detail
  const [name,setName] = useState('');
  const [nameOptions,setNameOptions] = useState([]);
  const [distribution,setDistribution] = useState('DC Tangerang');
  const [paymentType,setPaymentType] = useState('');
  const [expiredDate, setExpiredDate] = useState('');
  const [notes,setNotes] = useState('');
  const [today,setToday] = useState('');

  useEffect(() => {
    axios('http://dummy.restapiexample.com/api/v1/employees')  // sekiranya error, boleh pakai http://localhost:3000/users
    .then(({data}) => {
      setNameOptions(data)
    })
    .catch(err => {
      console.log(err.message,'error dummy names')
    })
  },[]);

  useEffect(() => {
    let now = moment().format('YYYY-MM-DD')
    setToday(now)
  },[])

  const optionName = () => {
    let names = []
    for(let i = 0 ; i<nameOptions.length ; i++) {
      names.push(<option> {nameOptions[i]['employee_name']} </option>)
    }
    return names;
  }

  //Products
  const [products,setProducts] = useState([{
      name:'Product Name',
      unit:'',
      quantity:0,
      price:0,    
    }]);
  
  const [productOptions,setProductOptions] = useState([]);

  useEffect(() => {
    axios('http://localhost:3000/products') 
    .then(({data}) => {
      setProductOptions(data)
    })
    .catch(err => {
      console.log(err.message,'error dummy products')
    })
  },[])

  const optionProduct = () => {
    let theProducts = [];
    productOptions.forEach(el => theProducts.push(<option> {el['product_name']} </option>))
    return theProducts
  };

  const countTotal = () => {
    let total = 0;
    products.map((el,i) => {
      total += (el.price*el.quantity)
    })
    return total.toLocaleString();
  };

  const handleFormProduct = (value,index,key) => {
    let clonedProducts = [];
    products.map((el,i) => clonedProducts.push(el));
    clonedProducts[index][key] = value;
    setProducts(clonedProducts);
  }

  const handleAddItem = () => {
    const clonedProducts = [];
    products.map((el,i) => clonedProducts.push(el));
    clonedProducts.push({ name:'Product Name', unit:'', quantity:0, price:0 })
    setProducts(clonedProducts);
  };

  const checkForm = () => {
    let flag = true;
    products.forEach((el) => {
      if(el.name === 'Product Name' || el.unit === '' || el.quantity === 0 ) {
        flag = false;
      }
    })
    return flag;
  }

  const checkDetail = () => {
    if(name === '' || paymentType === '' || expiredDate === '' ) {
      return false;
    }
    return true;
  }

  const handleConfirm = () => {
    let detail={name,distribution,paymentType,expiredDate,notes}
    let newObj = {
      detail,
      products
    }
    console.log(newObj,'order form')
  };

  return (
    <Container id="cover">
      <h1 className="mt-4">Create order</h1>
      <Form>
        <Container className="d-flex flex-row justify-content-between">
          <h3 id="detail">Detail</h3>
          <Container>
            <Container className="mb-3" >
              <Form.Label> Name</Form.Label> <Form.Label className="required">*</Form.Label>
              <Form.Control id="name" as="select" value={name} onChange={(e) => setName(e.target.value)} >
                <option selected="selected" value='' disabled > Name </option>
                {optionName()}
              </Form.Control>
            </Container>

            <Container className="mb-3">
              <Form.Label className="mb-0"> Distribution Center </Form.Label> <Form.Label className="required">*</Form.Label>
              <Form.Control id="distribution" as="select" value={distribution} onChange={(e) => setDistribution(e.target.value)} >
                {(name !== '') ? 
                <>
                  <option> DC Tangerang </option>
                  <option> DC Cikarang </option>
                </> :
                <>
                <option selected > No data available </option>
                </>
              }
              </Form.Control>
            </Container>            
            {
              (name !== '') &&
                <Container className="pl-0">
                  <Container className="d-flex flex-row">
                    <Container className="pl-0 ml-0">
                      <Form.Label className="mb-0" > Payment Type</Form.Label> <Form.Label className="required">*</Form.Label>
                      <Form.Control as="select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required >
                        <option value='' selected disabled> Payment Type </option>
                        <option> Cash H+1 </option>
                        <option> Cash H+3 </option>
                        <option> Cash H+7 </option>
                        <option> Transfer H+1 </option>
                        <option> Transfer H+3 </option>
                        <option> Transfer H+7 </option>
                      </Form.Control>
                    </Container>
                    <Container>
                      <Form.Label className="mb-0"> Expired Date</Form.Label> <Form.Label className="required">*</Form.Label>
                      <Form.Control
                      type="date"
                      value={expiredDate}
                      placeholder="Expired Date"
                      min={today}
                      onChange={(e) => setExpiredDate(e.target.value)}
                      />
                    </Container>
                  </Container>
                  <Container className="mt-2 ml-0">
                    <Form.Label className="mb-0" > Notes </Form.Label>
                    <Form.Control
                    type="textarea"
                    value={notes}
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}                 
                    />
                  </Container>
                </Container>
            }
          </Container>
        </Container>
        {
          (name !== '') &&
          <Container className="d-flex flex-row justify-content-between border-top mt-5 pt-3" >
            <h3 id="heading-product">Products</h3>
            <Container>
              {
              products.map((el,i) => {
                return(
                  <Product
                  key={i}
                  props={el}
                  selectProduct={productOptions}
                  optionProduct={optionProduct}
                  i={i}
                  products={products}
                  handleFormProduct={handleFormProduct}
                  />
                )
              })  
            }
            </Container>            
          </Container>              
        }
        {
          (name !== '') &&
          <Container>
            <Container className="d-flex flex-start">
              <Button 
              variant="warning"
              id="new-item"
              onClick={handleAddItem}
              > New Item </Button>
            </Container>

            <Container className="d-flex total-container">
              <Container id="total-label"><p><b> Total </b></p></Container>
              <Container id="count"><p><b> {countTotal()} </b></p></Container>          
            </Container>  
          </Container>
        }
        
        <Container className="d-flex flex-row-reverse border-top py-3 pr-5">
          <Button 
          variant={
            (checkDetail() && checkForm() ) ? 'success' : 'secondary'
          } 
          onClick={handleConfirm} 
          className="mx-2" 
          disabled={
            (checkDetail() && checkForm() ) ? false : true
          }
          >Confirm</Button>
          <Button variant="outline-danger">Cancel</Button>
        </Container>
      </Form>
    </Container>
  );
}

export default App;
