const express = require('express');

const bodyparser = require('body-parser');

const Mongoose = require('mongoose');

const app = express();

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended : true}));

const port = process.env.PORT || 3000;

Mongoose.connect("mongodb+srv://Sufiyan:o0dmignECqGhQkCa@student-o5coo.mongodb.net/Person?retryWrites=true&w=majority");

const PersonModal = Mongoose.model("Person",
{
    firstName:String,
    lastName:String,
    phoneNumber:String,
    cnicNumber:{
        type : String,
        required:true,
        unique:true,
        validate :
        {
            validator : (cnicNumber) =>
            {
                let re = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
                return (re.test(cnicNumber));

            },
            message : 'Provided CNIC number is invalid'
        }

    },
    motherName:String,
    Address:String,
    emailAddress:String,
    homePhonenumber:String,
    created:{
        type:Date,
        default : Date.now
    }
}
        
);

app.post('/person', async (req,res,next)=>{

    try
    {
        let person = new PersonModal(req.body);
        
        let result = await person.save((error , result)=>{
            
            if(!error)
            {
                console.log(result)
                res.send(`Person Added Successfully`);
            }
            else
            {
            console.log(error);
            res.send(error["errors"].cnicNumber["message"]);
            }
        });
        
   
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});

app.get('/person',async (req,res,next)=>{
    try
    {
        let Person = await PersonModal.find().exec();
        res.send(Person);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});

//Get Data by Mother Name

// app.get('/Person/:motherName',async (req,res,next)=>{
//     try
//     {
//         let Person = await PersonModal.find({motherName:req.params.motherName}).sort('-created').limit(5).exec((error,person)=>{
//             if(error) throw error;
//           //  console.log(person);
//             res.send( person);
//         });
        
//     }
//     catch(error)
//     {
//         res.status(500).send(error);
//     }
// })

//Get Data by CNIC

app.get('/Person/:CNIC',async (req,res,next)=>{
    let testObject =
    {
        cnicNumber:req.params.CNIC,
        
    };
    try
    {
        let Person = await PersonModal.find(testObject).exec((error,person)=>{
            if(error) throw error;
            let FirstName = person[0].firstName;
            
            res.send(person);
            console.log(`First name is ${FirstName}`);
         //   console.log(person);
        });
       // res.send(Person);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
})

////////////Update

app.put('/person/:id',async (req,res,next)=>{
    try
    {
        let person = await PersonModal.findById(req.params.id).exec();
        
        person.set(req.body);
        let result = await person.save();
        res.send(result);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});

app.delete('/person/:id',async (req,res,next)=>{
    try
    {
        let result = await PersonModal.deleteOne({_id:req.params.id}).exec();
        res.send(result);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});




app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})