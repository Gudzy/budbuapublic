import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { authenticate } from "./../../../store/actions/auth";
import CLOUD_URL from './../../../url';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';
import firebase from '../../../Firebase';
import Stats from "./Stats";
import UserStats from "./UserStats";
import IconLabelButtons from './../Buttons/IconLabelButtons';
import Spinner from './../Spinner/Spinner';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';


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

class Profile extends Component{  
    state = {
        fetchingstats: false,
        fetchingusers: false,
        fetchingreports: false,
        error: false,
        products: [],
        soldProducts: [], //All sold products
        userActiveProducts: [], //Users active products
        userTradeHistory: [], //All products from trades where the user has been involved
        userUid: "",
        userName: "Navn",
        userEmail: "ola_nordmann@gmail.com",
        userAddress: "Adresse",
        userPhoneNumber: "Telefonnummer",
        numActiveUsers: "0",
        isAdmin: false,
        statistics: [],
        users: []      
    }

    componentDidMount = async () => {
        await this.fetchProducts();
        this.fetchAdminStat();
        this.fetchReports();
        this.fetchUsers();
        console.log(this.state.users);
    }


    fetchUsers = async () => {
        if(this.props.isAuthenticated) {
            firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                //If active is false, user is banned
                var active = idTokenResult.claims.active;
                //If admin is true, the user has admin priveleges.
                var admin = idTokenResult.claims.admin;  
                if(admin){
                    this.setState({isAdmin: true});
                }
            }); 
            const userId = this.props.user.uid;
            try {
                this.setState({fetchingusers: true});
                let res = await axios.post(CLOUD_URL + 'getUsers',{
                    phone: userId
                });
                let users = res.data;
                this.setState({ users, fetchingusers: false});
            } catch(err) {
                console.log("Error: ", err);
                this.setState({error: true, fetchingusers: false})
            } 
        }
    }   
    
    fetchAdminStat = async () => {
        if(this.props.isAuthenticated) {
            firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                //If active is false, user is banned
                var active = idTokenResult.claims.active;
                //If admin is true, the user has admin priveleges.
                var admin = idTokenResult.claims.admin;  
                if(admin){
                    this.setState({isAdmin: true});
                }
            }); 
            const userId = this.props.user.uid;
            try {
                this.setState({fetchingstats: true});
                let res = await axios.post(CLOUD_URL + 'getStats',{
                    phone: userId
                });
                let stats = res.data;
                const statistics = [
                    {
                        id: 0,
                        name: "Aktive brukere",
                        number: stats["userCount"]},
                    {
                        id: 1,
                        name: "Aktive produkter",
                        number: stats["activeProducts"]},
                    {
                        id: 2,
                        name: "Varer solgt det siste døgnet",
                        number: stats["soldLastDay"]},
                    {
                        id: 3,
                        name: "Varer solgt den siste uken",
                        number: stats["soldLastWeek"]},
                    {
                        id: 4,
                        name: "Varer solgt den siste måneden",
                        number: stats["soldLastMonth"]},
                    {
                        id: 2,
                        name: "Totalt solgte produkter",
                        number: stats["soldProducts"]}
                ]
                this.setState({ statistics, fetchingstats: false});
            } catch(err) {
                console.log("Error: ", err);
                this.setState({error: true, fetchingstats: false})
            } 
        }
    }   

    fetchProducts = async () => {
        try {           
            console.log("Fetching products");
            this.setState({fetching: true});
            let res = await axios.post(CLOUD_URL + 'getProducts',{
                searchKey: ''
            });
            let products = res.data;
            
            products['id'] = res.id;
            console.log(products);
            let soldProducts = [];
            let userActiveProducts = [];
            let userTradeHistory = [];
            products.map(element => {
                if(element.isSold)
                    soldProducts.push(element);
                if((!(element.isSold)) && firebase.auth().currentUser.uid == (element.sellerUid))
                    userActiveProducts.push(element);
                if(element.isSold && firebase.auth().currentUser.uid == (element.sellerUid || element.buyerUid))
                    userTradeHistory.push(element);
            });
            this.setState({ products, soldProducts, userActiveProducts, userTradeHistory, fetching: false});
        } catch(err) {
            this.setState({error: true, fetching: false})
        }
    }

    fetchReports = async () => {
        if(this.props.isAuthenticated) {
            firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                //If active is false, user is banned
                var active = idTokenResult.claims.active;
                //If admin is true, the user has admin priveleges.
                var admin = idTokenResult.claims.admin;  
                if(admin){
                    this.setState({isAdmin: true});
                }
            }); 
            const userId = this.props.user.uid;
            try {           
                console.log("Fetching reports");
                this.setState({fetchingreports: true});
                let res = await axios.post(CLOUD_URL + 'getReports',{
                    phone: userId
                });
                // let res = await axios.post(CLOUD_URL + 'getReports');
                let reports = res.data;
                reports['id'] = res.id;
                console.log(res.data);
                this.setState({ reports: res.data, fetchingreports: false});
            } catch(err) {
                this.setState({error: true, fetchingreports: false});
                console.log("Error fetching reports: ", err);
            }
        }
    }


    renderAdminStatistics(){
        //Render general application statistics if user has admin rights. 
        if(this.state.isAdmin){
            return(
                <div>
                    <h3>Administrator statistikk</h3>
                    <IconLabelButtons type="Refresh" action={this.fetchAdminStat} disabled={!this.props.isAuthenticated}/>
                    {this.state.fetchingstats ? <Spinner /> : <Stats data = {this.state.statistics}/> }
                </div>  
            );
        }
    }

    renderAdminUsers(){
        //Render users if user has admin rights
        if(this.state.isAdmin) {
            const userId = this.props.user.uid;
            return(
                <div style={styles.adminusers}>
                    <h3>Brukere</h3>
                    <IconLabelButtons type="Refresh" action={this.fetchUsers} disabled={!this.props.isAuthenticated}/>
                    {this.state.fetchingusers ? <Spinner /> : <UserStats data={this.state.users} phone={userId}/>}
                </div>
            )
        }
    }

    renderItemsForSale(){
        let { userActiveProducts } = this.state;
        return (
            <div>
                {/*Må endres til ønsket oppsett og hente produkter fra userActiveProducts og userTradeHistory, og ikke fra products på ønskede steder. */}
                <List component="nav">
                    {userActiveProducts.map(product =>
                        <Link key={product.id} to={{pathname: `/market/${product.id}`, search: product.id}} style={{color: 'white'}}>
                            <ListItem button >
                                <ListItemText inset primary={product.title} secondary={"Selger: " + product.sellerUid + ", kjøper: " + 
                                product.buyerUid + ', price: ' + (product.buyerUid ? product.currentBid : product.startPrice) + ' kr'} />
                            </ListItem>
                            <Divider light />
                        </Link>
                    )}
                </List>
            </div>
        );
    }


    renderHistory(){
        let { userTradeHistory } = this.state;
        return (
            <div>
                {/*Må endres til ønsket oppsett og hente produkter fra userActiveProducts og userTradeHistory, og ikke fra products på ønskede steder. */}
                <List component="nav">
                    {userTradeHistory.map(product =>
                        <Link key={product.id} to={{pathname: `/market/${product.id}`, search: product.id}} style={{color: 'white'}}>
                            <ListItem button >
                                <ListItemText inset primary={product.title} secondary={"Selger: " + product.sellerUid + ", kjøper: " + 
                                product.buyerUid + ', price: ' + (product.buyerUid ? product.startPrice : product.currentBid) + ' kr'} />
                            </ListItem>
                            <Divider light />   
                        </Link>
                    )}
                </List> 
            </div>
        );
    }

    renderReports(){
        if(this.state.isAdmin && this.state.reports) {
            let { reports, showReport, report } = this.state;
            return (
                <div>
                    <h3>Rapporter</h3>
                    <IconLabelButtons type="Refresh" action={this.fetchReports} disabled={!this.props.isAuthenticated}/>
                    {this.state.fetchingreports ? <Spinner /> :
                    <List component="nav">
                        {reports.map(report =>
                            <div>
                                <ListItem onClick={() => this.setState({showReport: true, report})}>
                                    <ListItemText inset primary={report.description} secondary={"Selger: " + report.sellerUid}/>
                                </ListItem>
                                <Divider light />
                            </div>                        
                        )}
                    </List>}
                    {showReport && report ? this.renderReport() : ""}
                </div>
            );
        }
    }

    renderReport() {
        const { report, showReport } = this.state;
        return(
            <Modal 
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={showReport}
              onClose={()=> this.setState({showReport: false, user: ""})}>
              <div className={modalStyles.paper} style={this.getModalStyle()}>
            <Card style={styles.inputcard} raised>
              <CardContent>
                  <h1>Rapport</h1>
                  <Typography gutterBottom variant="h5" component="h2">
                    {report.sellerUid}
                  </Typography>
                  <Typography component="p">
                    {report.description}
                </Typography>          
              </CardContent>
            <IconLabelButtons type="Lukk" action={() => this.setState({ showReport: false, report: ""})} />
                <CardActionArea style={styles.actionArea}>
                        <CardMedia style={styles.media} image="https://imgur.com/Lr3KJIl.jpg" title="Budbua"/>
                </CardActionArea>
                </Card>
                </div>
            </Modal>
        )
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


    render(){
        if (this.state.isAdmin === true){
            console.log("adminn");
        }
        const { isAuthenticated, user } = this.props;
        return(
            <div>
                {isAuthenticated && user && 
                    <div>
                        <div style={styles.topBar}>
                            <div style={styles.userCard}>
                                <div style={styles.userInfo}>
                                    <h2>Bruker</h2>
                                    <p>
                                        Telefon: {user.uid}<br />
                                        Epost: {user.email}
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                        <div class="row">
                            <div class="column" style={styles.leftColumn}> {/*Items that the user currently has for sale*/}
                                <h2>Varer for salg</h2>
                                    {this.renderItemsForSale()}
                                
                            </div>
                            <div class="column" style={styles.rightColumn}> {/*Sales that the user has been involved in*/}
                                <h2>Historikk</h2>
                                    {this.renderHistory()}
                            </div>
                        </div>
                    
                        <div style={styles.adminInfo}>
                            {this.renderAdminStatistics()}  
                        </div>

                        <div style={styles.reports}>
                            {this.renderReports()}
                        </div>
   
                        <div style={styles.adminInfo}>
                            {this.renderAdminUsers()}  
                        </div>  

                        <div style={styles.bottomLine}>

                        </div>
                    </div>
                }    
                {isAuthenticated ? '' : <Redirect to='/login' />}
            </div>
        );
    }
}

const styles = {
    StarIcon: {
        color: 'gold'
    },
    card: {
        maxWidth: 400,
        margin: 'auto',
        maxHeight: 860
    },
    container: {
        padding: 10
    },
    inputField: {
        width: '80%',
        margin: 'auto',
        padding: 6,
    },
    dateField: {
        widt: '80%',
        margin: 'auto',
        padding: 6,
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
    media: {
        height: 90,
        width: 200,
        margin: 'auto',
    },
    media2: {
        height: 150,
        width: 200,
        margin: 'auto',
    },
    userCard: {
        float: 'left',
        marginTop: 10,
        marginLeft: '10%',
        width: 300,
        height:130,
        backgroundColor: '#F0F0F0', 
    },
    userInfo: {
        textAlign: 'left',
        marginLeft: 20,
    },
    adminInfo: {
        clear: 'both',
        float: 'center',
        marginLeft: '10%',
        width: '80%',
        marginLeft: '10%',
    },
    itemsForSale: {
        float: 'left',
        width: 500,
        margin: 'auto',
    },
    topBar: {
        height: 200,
        width: '100%',
    },
    leftColumn: {
        float: 'left',
        marginLeft: '5%',
        marginRight: '5%',
        width: '40%',
    },
    rightColumn: {
        float: 'right',
        width: '40%',
        marginLeft: '5%',
        marginRight: '5%',
    },
    reports: {
        clear: 'both',
        float: 'center',
        marginLeft: '10%',
        width: '80%',
        marginLeft: '10%',
    },
    bottomLine: {
        margin: 10,
        clear: 'both',
        width: '100%',
        height: 10,
    },
    inputcard: {
        maxWidth: 400,
        margin: 'auto',
        maxHeight: 400,
        textAlign: 'center'
        },
    media: {
          height: 90,
          width: 200,
          margin: 'auto',
      },
    adminusers: {
        marginBottom: 100
    }
}
 const mapStateToProps = state => ({
    isAuthenticated: !_.isEmpty(state.auth.user),
    user: state.auth.user,
})
export default connect( mapStateToProps, { authenticate } )( Profile );