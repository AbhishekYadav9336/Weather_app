const fs=require("fs");
const http=require("http");
const requests=require("requests");
const rdhome=fs.readFileSync("home.html","utf-8");
//this function is for for replacing the static value to real api value
const replaceval=(tempval,orgval)=>{
         let temperature=tempval.replace("{%temp%}",orgval.main.temp);
          temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
          temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
          temperature=temperature.replace("{%location%}",orgval.name);
          temperature=temperature.replace("{%country%}",orgval.sys.country);
          temperature=temperature.replace("{%status%}",orgval.weather[0].main);
          return temperature;
};
const server =http.createServer((req,res)=>{
    if(req.url=="/")
    {
       
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&units=metric&appid=f14d5a07e7049134ba14406b38cc811c"
            )
            .on("data",(chunk)=>
            {
              const objdata=JSON.parse(chunk);//to convert  raw data into parse of the api
              const arrData=[objdata];//making array of obtained data 
              
               //console.log(arrData.main);
               //calling replaceval with two parameter rdhome,val 
               const realTimeData =arrData.map(val => replaceval(rdhome,val)).join("");
               res.write(realTimeData);
            
            })
            //for anny error
            .on("end",(err)=>{
                if(err) return console.log("connetion closed due to error",err);
                res.end();
            });
        }
    
});
server.listen(8000,"127.0.0.1",()=>
{
    console.log("listen to the port no. 8000");
}
)