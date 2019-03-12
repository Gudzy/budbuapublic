import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase/app';

import { authenticate } from "./../../../store/actions/auth";
import CLOUD_URL from './../../../url';
import Spinner from './../Spinner/Spinner';
import BudImage from './../../../eksempel-bilde-300x300.png';


import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class Product extends Component{
    state = {
        fetching: false,
        error: false,
        product: null,
        report: false,
        description: '',
        sellerUid: '',
        resdescription: 'Beskriv problemet',
        biddescription: 'Oppgi ditt bud - Må minst øke med 3%',
        newBid: ''
    }

    componentDidMount = async () => {
        await this.fetchProduct();
    }

    fetchProduct = async () => {
        //Selected product's firebase document id:
        let id = window.location.search.replace('?','');
        try {
            this.setState({fetching: true });
            let res = await axios.post(CLOUD_URL + 'getProduct',{
                id
            });
            let product = res.data;
            let newBid = product.currentBid > 0 ? product.currentBid * 1.03 : product.startPrice;
            this.setState({ product, fetching: false, newBid});
        } catch(err) {
            this.setState({error: true, fetching: false});
        }
    }

    makeBid = async () => {
        const { newBid } = this.state;
        const productId = window.location.pathname.split('/').filter(function(el){ return !!el; }).pop();
        let buyerUid = firebase.auth().currentUser.uid;        
        if( newBid && buyerUid && productId ) {
          try {
            this.setState({fetching: true});
            try {
              await axios.post(CLOUD_URL + 'makeBid', { buyerUid, newBid: Math.abs(newBid), productId});
              this.setState({ fetching: false, bid: false});
              this.fetchProduct();
            } catch(err) {
              this.setState({ biddescription: 'Ikke høyt nok bud, oppdater siden', fetching: false});
            }
          } catch(err) {
          }
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const key = target.id;
        this.setState({
            [key]: value
        });
    }

    handleReporting = async () => {
      const { description, product} = this.state;
      const sellerUid = product.sellerUid;
      if( description && sellerUid ) {
        try {
          this.setState({fetching: true});
          try {
            await axios.post(CLOUD_URL + 'addReport', {sellerUid, description});
            this.setState({ fetching: false, report: false});
            this.fetchProduct();
          } catch(err) {
            this.setState({ resdescription: 'Galt med rapportering', fetching: false});
          }
        } catch(err) {
        }
      }
    }

    report = () => {
        this.setState({report: !this.state.report})
    }

    bid = () => {
        this.setState({bid: !this.state.bid})
    }

    renderReporting() {
      const { description, fetching, resdescription } = this.state;
      return(
          <div style={styles.container}>
          <Card style={styles.inputcard} raised>
                  <h1>Rapportering</h1>
              <div style={styles.inputField3}>
                  <TextField
                      required
                      id="description"
                      variant="outlined"
                      label="Beskrivelse"
                      type="String"
                      value={description}
                      onChange={this.handleChange}
                      helperText = {resdescription}
                  />
              </div>
              {fetching ? <Spinner/> :
              <div>
                  <IconLabelButtons type="Rapporter" action={this.handleReporting} disabled={description.length < 1}/>
                  <IconLabelButtons type="Avbryt" action={this.report} />
              </div>
              }
              <CardActionArea style={styles.actionArea}>
                      <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
              </CardActionArea>
              </Card>
          </div>
      )
    }


    renderBid() {
        const { fetching, biddescription, newBid, product } = this.state;
        return(
            <div style={styles.container}>
            <Card style={styles.inputcard} raised>
                    <h1>By på varen</h1>
                    <h3> {"Nåværende bud: " + product.currentBid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }</h3>
                    <h3> {"Startpris: " + product.startPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }</h3>
                <div style={styles.inputField3}>
                    <TextField
                        required
                        id="newBid"
                        variant="outlined"
                        label="Ditt bud"
                        type="number"
                        value={newBid}
                        onChange={this.handleChange}
                        helperText = {biddescription}
                    />
                </div>
                {fetching ? <Spinner/> :
                <div>
                    <IconLabelButtons type="Send bud" action={this.makeBid} disabled={newBid.length < 1 || newBid < product.currentBid * 1.03 || newBid < product.startPrice}/>
                    <IconLabelButtons type="Avbryt" action={this.bid} />
                </div>
                }
                <CardActionArea style={styles.actionArea}>
                        <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                </CardActionArea>
                </Card>
            </div>
        )
      }

    renderProduct = () => {
        const { isAuthenticated } = this.props;
        const { product } = this.state;
        const refTime = new Date(2018,1,1).getTime();
        return (
            <div>
            {product && (
                <div>
                <Card style={styles.card}>
                    <Grid container wrap="nowrap">
                    <div>
                      <Grid item style={styles.grid2}>
                      <CardActionArea style={styles.actionArea} >
                      <h1 style={styles.text3}>{product.title}</h1>
                        <section className="image" id="html">
                        <img style={styles.image} src={product.imageConverted} alt={BudImage}/>
                        </section>
                      </CardActionArea>
                      </Grid>
                      </div>

                      <Grid style={styles.grid}>
                        <h3>Startpris:</h3>
                        <h3>{product.startPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</h3>
                        <br />
                        <h3>Nåværende bud:</h3>
                        <h3>{product.currentBid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</h3>
                        <br />
                        <h3>Slutt-tidspunkt:</h3>
                        <h3> {"📅" + new Date(refTime +product.finishTimeInt).toDateString().split('T')[0]}</h3>
                        <h3> {"⌚" + new Date(refTime +product.finishTimeInt).toLocaleTimeString()}</h3>
                      </Grid>
                    </Grid>
                        <h3 style={styles.text3}>Kontakt selger:</h3>
                        <h3 style={styles.text3}>Tlf: {product.sellerUid}</h3>
                        <h3 style={styles.text3}>E-post: {product.sellerEmail} </h3><div style={styles.text4}>
                        <IconLabelButtons type="Legg inn bud" action={this.bid} disabled={!isAuthenticated}/>
                        <IconLabelButtons type="Rapporter selger" action={this.report} disabled={!isAuthenticated}/>
                    </div>   
                </Card>
                </div>
            )}
            </div>

        )
    }

    render() {
        const { fetching, report, bid } = this.state;
        return(
            <div>
                {fetching ? <Spinner/>
                : (report ? this.renderReporting() : bid ? this.renderBid() : this.renderProduct())}
            </div>
        );
    }
}

const styles = {
   StarIcon: {
       color: 'gold'
   },
   card: {
       maxWidth: 600,
       margin: 'auto',
       maxHeight: 900,
       marginTop: 20

   },
   inputcard: {
    maxWidth: 400,
    margin: 'auto',
    height: 550
    },
   container: {
       padding: 10
   },
   inputField: {
       width: '80%',
       margin: 'auto',
       padding: 10,
   },
   inputField3: {
       width: '85%',
       margin: 'auto',
       padding: 10,
   },
   link: {
       color: 'dodgerblue',
       textDecoration: 'none'
   },
   list: {
       width: '50%',
       margin: 'auto',
       color: 'paper',
       ListItem: { color: 'paper'},
   },
   text: {
       padding: 0,
   },
   text2: {
       padding: 24,
   },
   text3: {
       textAlign: "left",
       marginLeft: 30,
   },

   text4: {
       marginBottom: 0,
       paddingTop: 0,
   },

   media: {
       height: 90,
       width: 200,
       margin: 'auto',
   },
   media2: {
       maxHeight: 150,
       maxWidth: 200,
       margin: 'auto',
   },

   image: {
      height: 200,
      widt: 200,
      borderRadius: 4
    },

    imageBig: {
       height: '100%',
       widt: '100%',
     },

    grid: {
       width: 300,
       paddingTop: 40,
       right: '20%',
     },

     grid2: {
        marginLeft: 20,
        marginTop: 20,
        maxWidth:300,
        higth: 200
      },
}

const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
});

export default connect( mapStateToProps, { authenticate } )( Product );
