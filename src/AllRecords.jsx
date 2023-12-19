import React, {useState, useEffect} from "react";

function AllRecords(){
    const [data, setData] = useState([])

    useEffect(() =>{
        fetch("http://localhost:4001/api/data")
        .then((res) => res.json())
        .then((data) => setData(data))
    }, [])

    return(
        <div className="App">
        <h1>Data from MongoDB</h1>
        
        {
        data.map((item) => (
            <div key={item._id}>{item._id}</div> // Replace with your data attributes
        ))}
    </div>
    )
}

export default AllRecords;