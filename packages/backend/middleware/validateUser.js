const validateUser = (req, res, next) => {
    const { name, email, password, lname, gender} = req.body;
  
    if (!name || !lname || !email || !password ||!gender  ) {
      return res.status(400).send({ error: "All fields are required" });
    }
  
    next();
  };
  
  export default validateUser;
  