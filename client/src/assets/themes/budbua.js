import { createMuiTheme } from "@material-ui/core/styles"
import { red } from "@material-ui/core/colors"
import blue from '@material-ui/core/colors/blue';


const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#777777',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#CC0E50',
      main: '#EF700E',
      dark: '#B20A44',
      // dark: will be calculated from palette.secondary.main,
    }
}
});

console.log(theme)

export default theme
