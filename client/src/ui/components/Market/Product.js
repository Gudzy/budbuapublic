import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase/app';
import Countdown from 'react-countdown-now';

import { authenticate } from './../../../store/actions/auth';
import CLOUD_URL from './../../../url';
import Spinner from './../Spinner/Spinner';
import GoogleMapsContainer from '../GoogleMaps/GoogleMapsContainer';
import BudImage from './../../../assets/img/eksempel-bilde-300x300.png';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconLabelButtons from './../Buttons/IconLabelButtons';
import TextField from '@material-ui/core/TextField';
import Image from 'material-ui-image';
import Modal from '@material-ui/core/Modal';


import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import ExpandMoreIcon from '@material-ui/icons/AddLocationSharp';
import MoreVertIcon from '@material-ui/icons/Report';

export class Product extends Component{
    state = {
        fetching: false,
        error: false,
        product: null,
        report: false,
        description: '',
        sellerUid: '',
        resdescription: 'Beskriv problemet',
        biddescription: 'Oppgi ditt bud - Må minst øke med 3%',
        newBid: '', 
        expanded: true,
    }

    componentDidMount = async () => {
        await this.fetchProduct();
        
    }

    fetchProduct = async () => {
        //Selected product's firebase document id:
        let id = window.location.search.replace('?','');
        const refTime = await new Date(2018,1,1).getTime();
        try {
            this.setState({fetching: true });
            let res = await axios.post(CLOUD_URL + 'getProduct',{
                id
            });
            let product = res.data;
            let newBid = product.currentBid > 0 ? product.currentBid * 1.03 : product.startPrice;
            const date = await new Date(refTime + product.finishTimeInt).toLocaleDateString();
            const time = product.finishTime;
            const sec = await new Date(product.finishDate + "T" + product.finishTime);
            const now = await new Date();
            product['date'] = date;
            product['time'] = time;
            product['sec'] = sec.valueOf() - now.valueOf();
            this.setState({ product, fetching: false, newBid });
            
            const ny = await new Date(refTime + product.finishTimeInt);
            ny.setDate(ny.getDate() +2);
            console.log(ny.toLocaleString());
            
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

    getModalStyle() {
        const top = 10 ;
      
        return {
          margin: '0 auto',
          maxWidth: 340,
          position: 'relative',
          marginTop: 100
        };
      }

    renderReporting() {
      const { description, fetching, resdescription } = this.state;
      return(
          <Modal 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.report}
            onClose={this.report}>
            <div className={modalStyles.paper} style={this.getModalStyle()}>
          <Card style={styles.inputcard} raised>
            <CardContent>
            <h1>Rapporter</h1>
            </CardContent>
                  
              <div style={styles.inputField3}>
                  <TextField
                      required
                      id="description"
                      variant="outlined"
                      label="Beskrivelse"
                      type="String"
                      value={description}
                      multiline
                      rowsMax="10"
                      rows="10"
                      onChange={this.handleChange}
                      helperText = {resdescription}
                  />
              </div>
              {fetching ? <Spinner/> :
              <div>
                  <IconLabelButtons type="Send" action={this.handleReporting} disabled={description.length < 1}/>
                  <IconLabelButtons type="Avbryt" action={this.report} />
              </div>
              }
              <CardActionArea style={styles.actionArea}>
                      <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
              </CardActionArea>
              </Card>
          </div>
          </Modal>
      )
    }


    renderBid() {
        const { fetching, biddescription, newBid, product } = this.state;
        return(
            <Modal 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.bid}
            onClose={this.bid}>
            <div className={modalStyles.paper} style={this.getModalStyle()}>
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
          </Modal>





            
        )
      }

      renderProduct = () => {
        
        const { isAuthenticated } = this.props;
        const { product, expanded } = this.state;
        
        
        /** 
        geocoder.geocode('29 champs elysée paris', function(err, res) {
            console.log(res);
        });*/
        return (
            <div>
            {product && (
                <div>
                <Card style={styles.card}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="Recipe" className={styles.avatar}>
                                {product.title[0]}
                            </Avatar>
                        }
                        action={
                            <IconButton onClick={this.report}>
                            <MoreVertIcon/>
                            </IconButton>
                        }
                        title={product.title}
                        subheader={"📅 " + product.date  + "  ⌚ " + product.time }
                    />
                    <CardActionArea>
                        <Image src={product.imageConverted} imageStyle={{paddingTop: 10, display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%'}} alt={BudImage}></Image>
                    </CardActionArea>
                   
                    <CardContent style={styles.content}>
                        <div style={styles.details}>
                        <Typography component="h5" variant="h6">Startpris: </Typography>
                        <Typography  variant="subtitle1" color="textSecondary">{product.startPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</Typography>
                        <Typography component="h5" variant="h6">Nåværende bud: </Typography>
                        <Typography  variant="subtitle1" color="textSecondary">{product.currentBid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</Typography>
                        </div>
                        <div>
                        <Typography component="h5" variant="h6">E-post: </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {"📧 " + product.sellerEmail} 
                            </Typography>
                            <Typography component="h5" variant="h6">Telefon: </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {"📱 " + product.sellerUid} 
                            </Typography>
                        </div>
                    </CardContent>  
                    <IconLabelButtons type="Legg inn bud" action={this.bid} disabled={!isAuthenticated}/>
                    <Countdown
    date={Date.now() + product.sec}
    renderer={renderer}
    precision={15}

  />
                    <CardActions className={styles.actions} disableActionSpacing>
       
        <IconButton
          aria-expanded={expanded}
          aria-label="Show more"
        >
        
          <ExpandMoreIcon />
        </IconButton>
        <Typography variant="subtitle1" color="textSecondary">{product.location}</Typography>
        
      </CardActions>
                <GoogleMapsContainer lat={product.lat} lng={product.lng} title={product.title} sellerUid={product.sellerUid} adress={product.location}></GoogleMapsContainer>
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
                : this.renderProduct()}
                {report ? this.renderReporting() : ''}
                {bid ? this.renderBid() : ''}
            </div>
        );
    }
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return <div className="Countdown">
      <span className="Countdown-col">
        <span className="Countdown-col-element">
            <strong>{days}</strong>
            <span>{days === 1 ? 'Day' : 'Days'}</span>
        </span>
      </span>

      <span className="Countdown-col">
        <span className="Countdown-col-element">
          <strong>{hours}</strong>
          <span>Hours</span>
        </span>
      </span>


      <span className="Countdown-col">
        <span className="Countdown-col-element">
          <strong>{minutes}</strong>
          <span>Min</span>
        </span>
      </span>

      <span className="Countdown-col">
        <span className="Countdown-col-element">
          <strong>{seconds}</strong>
          <span>Sec</span>
        </span>
      </span>
    </div>
      
      
      
    }
  };
  const Completionist = () => <span>Time out</span>;
  const modalStyles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      outline: 'none',
    },
  });

const styles = {
    paper: {
        position: 'absolute',
        outlined: 'none',
        },
   StarIcon: {
       color: 'gold'
   },
   card: {
       maxWidth: 600,
       margin: 'auto',
       marginTop: 20,
   },
   content: {
       display: 'flex',

   },
   details: {
    flex: '0.5  auto',
   },
 
  contact: {
    display: 'flex',
  },
    media: {
        height: 200,
    },
    actions: {
        display: 'flex',
    },

    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
   inputcard: {
    maxWidth: 400,
    margin: 'auto',
    height: 550,
    textAlign: 'center'
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
       paddingBottom: 30,
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


