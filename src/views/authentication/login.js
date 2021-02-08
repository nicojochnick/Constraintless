import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Signin, signInWithGoogle, signInWithGitHub } from "../../helpers/auth";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import { FaBoxOpen } from "react-icons/fa";

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: "" });
        try {
            console.log(this.state.email, this.state.password)
            await Signin(this.state.email, this.state.password);
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div style = {{backgroundColor:"black", padding: 30,}}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline>
                        <div className={classes.paper}>
                            <p style = {{fontSize: 50, fontWeight: 600, marginTop: 0, marginBottom: 10, color:"white"}}> Login</p>
                            <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="Email"
                                    type="email"
                                    onChange={this.handleChange}
                                    InputProps= {{className: classes.textField, disableUnderline: true}}
                                    value={this.state.email}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    id="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    name="password"
                                    InputProps= {{className: classes.textField, disableUnderline: true}}
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    type="password"
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary" />}
                                    label="Remember me"
                                />

                                {this.state.error ? (
                                    <p>{this.state.error}</p>
                                ) : null}
                                {/*<button type="submit">Login</button>*/}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    style={{borderRadius: 5,borderWidth: 2, borderColor: 'white', margin:5, backgroundColor: 'black',}}>
                                    <p style = {{color: 'white', fontSize: 15, margin: 2, marginRight: 25, marginLeft: 25,fontWeight: 800}}>
                                        Login
                                    </p>
                                </Button>
                            </form>

                            {/*<div>*/}
                            {/*    <form*/}
                            {/*        autoComplete="off"*/}
                            {/*        onSubmit={this.handleSubmit}*/}
                            {/*    >*/}
                            {/*        <p>*/}
                            {/*            Don't have an account? <Link to="/signup">Sign up</Link>*/}
                            {/*        </p>*/}
                            {/*    </form>*/}
                            {/*</div>*/}
                        </div>
                    </CssBaseline>
                </Container>
            </div>
        );
    }
}


const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textField: {
        disableUnderline: true,
        color: 'white',

    }
});


export default withStyles(styles, { withTheme: true })(login);
