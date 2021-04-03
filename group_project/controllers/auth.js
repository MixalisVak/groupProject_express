var dbconnection = require('../lib/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const { Console } = require('console');


async function login(req, res){
    try {
        const { emailAddress, password} = req.body;

        if(!emailAddress || !password){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        dbconnection.query('SELECT * FROM user WHERE emailAddress = ?', [emailAddress], async (err, results) => {
            
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect'
                })
            }else {
                const id = results[0].user_id;
                
                const token = jwt.sign({ id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });


                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        });


    }catch (error){
        console.log(error)
    }
}


async function register(req, res){
    const { first_name,
        last_name,
        emailAddress,
        phoneNumber,
        country,
        password,
        confirm_pass
    } = req.body

    if (password !== confirm_pass){
        return res.render('signup', {message: 'Passwords do not match'})
    }else{
        dbconnection.query('SELECT emailAddress FROM user WHERE emailAddress = ?', [emailAddress], async (err, results) => {
            if (err) {
                console.log(err)
            }
            if (results.length > 0){
                return res.render('signup', {message: 'That email is already in use'})
            }
            
            let hashedPassword = await bcrypt.hash(password, 8);
            const query = `INSERT INTO user(first_name, last_name, emailAddress, country, phone_number, password  ) VALUES( '${first_name}',
                            '${last_name}',
                            '${emailAddress}',
                            '${country}',
                            '${phoneNumber}',
                            '${hashedPassword}'
            )`;
            dbconnection.query(query,  (err, results) => {
    
                if (err){
                    console.log(err)
                } else{
                    
                    res.status(200).redirect('/login')
                }
            })
    
        });
    }
    
}

async function donation(req, res){
    const { 
        emailAddress,
        amountMoney
    } = req.body


    dbconnection.query('SELECT * FROM user WHERE emailAddress = ?', [emailAddress], async (err, results) => {
        let user_id = results[0].user_id;
        const query = `INSERT INTO donation(amount, user_id, charity_id) VALUES( ${amountMoney},'${user_id}','${5}')`;

        dbconnection.query(query,  (err, results) => {

        if (err){
            console.log(err)
        } else{
            console.log(results)
            res.status(200).redirect('/')
        }
        })
    })
    
}


async function isLoggedIn(req, res, next){
    console.log(req.cookies)
    if(req.cookies.jwt){
        try{
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            console.log('decoded',decoded)
            dbconnection.query('SELECT * FROM user WHERE user_id = ?', [decoded.id], (err, result)=>{
               

                if(!result){
                    return next();
                }

                req.user = result[0];
                return next();
            });
        }catch(err){
            console.log(err)
            return next();
        }
    }else{
        next();
    }
}


async function logout(req, res){
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });
  
    res.status(200).redirect('/')
}


module.exports = {
    login,
    register,
    isLoggedIn,
    logout,
    donation
}