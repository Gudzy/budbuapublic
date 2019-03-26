import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Countdown from 'react-countdown-now';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: '1',
    color: 'white',
    backgroundColor: theme.palette.background.paper,
  },
  grid: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 4,
    minWidth: '300px', // To be removed once the theme is defined
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#C6C6C6',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

function Album(props) {
  const { classes, products } = props;

  return (
      <Grid container className={styles.root} spacing={3}>
        {products.map(card => (
            <Grid className={classes.grid} item xs={12} sm={6} md={4} lg={2} key={card.id}>
            <Card className={classes.card} style={{backgroundColor: "white"}}>
              <CardMedia
                className={classes.cardMedia}
                image={card.imageConverted}
                title={card.title}
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography component="h5" variant="h7">Startpris: </Typography>
                    <Typography  variant="subtitle1" color="textSecondary">{card.startPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</Typography>
                    <Typography component="h5" variant="h7">Nåværende bud: </Typography>
                    <Typography  variant="subtitle1" color="textSecondary">{card.currentBid.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " kr"}</Typography>

              </CardContent>
              <CardActions>
              <Link key={card.id} to={{pathname: `/market/${card.id}`, search: card.id}} style={{color: 'white', textDecoration: 'none'}}>
                <Button size="Large" color="secondary">
                  Les mer
                </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
  );
}

Album.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Album);