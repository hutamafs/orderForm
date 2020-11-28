import React from 'react';
import { Container , Form } from 'react-bootstrap';

const Product = ({ i , props , selectProduct , optionProduct , products , handleFormProduct }) => {

  const unitOptions = () => {
    let options = [];
    let usedUnit = [];
    const foundIndex = selectProduct.findIndex((el) => el['product_name'] === props.name);

    let theUnits = selectProduct[foundIndex]['units'].map(el => {
      return el.name
    })

    products.forEach((prod) => {
      if(prod.name === selectProduct[foundIndex]['product_name']) {
        usedUnit.push(prod.unit)
      }
    })

    let availableUnits = theUnits.filter(el => {
      return !usedUnit.includes(el)
    })

    // console.log(availableUnits,'ini line 24');

    // console.log(usedUnit,'ini line 20');

    // console.log(theUnits,'ini line 14');

    availableUnits.map((el,i) => {
      return (
        options.push( <option key={i} value={el} > {el} </option> )
      )
    })

    options.push( <option defaultValue disabled hidden> {props.unit} </option> )     

    return options
  }

  const handleChange = (e,type) => {
    handleFormProduct(e.target.value,i,type)
  }

  const handleUnitChange = (e) => {
    handleFormProduct(e.target.value,i,'unit');
    const indexProduct = selectProduct.findIndex((el) => el['product_name'] === props.name);
    const indexUnit = selectProduct[indexProduct]['units'].findIndex((el) => el['name'] === e.target.value);
    let unitPrice =  selectProduct[indexProduct]['units'][indexUnit]['price'];
    handleFormProduct(unitPrice,i,'price')
    handleFormProduct(1,i,'quantity')
  }
    
    return (
            <Container>
              <Container className="d-flex justify-content-between">
                <Container>
                  <Form.Label> Product </Form.Label> <Form.Label className="required">*</Form.Label>
                  <Form.Control as="select" value={props.name} onChange={(e) => handleChange(e,'name')} style={{width:'400px'}} required >
                    <option value='' disabled> Product Name </option>
                    {optionProduct()}
                  </Form.Control>
                </Container>
                <Container>
                  <Form.Label> Unit </Form.Label> <Form.Label className="required">*</Form.Label>
                    <Form.Control as="select" value={props.unit} onChange={(e) => handleUnitChange(e)} required>
                      {(props.name === '') ? <> <option> Unit </option> </> :
                        <> <option value='' disabled> Choose One...  </option>  {unitOptions()} </>              
                      }
                    </Form.Control>
                </Container>
              </Container>

              <Container className="d-flex flex-row mt-3">

                <Container>
                  <Form.Label className="mb-0"> Quantity </Form.Label> <Form.Label className="required">*</Form.Label>
                  <Form.Control 
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  required
                  value={(props.quantity) ? props.quantity : 'quantity'} 
                  onChange={(e) => handleChange(e,'quantity')} 
                  >
                  </Form.Control>
                </Container>

                <Container>
                <Form.Label className="mb-0"> Price </Form.Label> <Form.Label className="required">*</Form.Label>
                <Form.Control 
                type="number"
                value={props.price}
                disabled
                style={{width:'45%'}}>
                </Form.Control>
                </Container>

                <Container>
                  <Form.Label className="d-flex justify-content-end"> Total Price </Form.Label>
                  <Form.Control
                  className="text-right pr-0"
                  type="number"
                  value={props.price * props.quantity}
                  disabled
                  >
                  </Form.Control>
                </Container>
                
              </Container>

              <Container className="mt-2 d-flex flex-row justify-content-between border-top py-2" style={{width:'48%',marginLeft:'380px'}}>
                <Container>
                  <p><b> Total Nett Price </b></p>
                </Container>
                <Container  className="pl-0">
                  <p className="text-right"><b> {(props.price*props.quantity).toLocaleString()} </b></p>
                </Container>
              </Container>     

            </Container>
    )
}

export default Product;