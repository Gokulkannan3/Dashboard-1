import { useEffect, useState } from 'react'
import axios from 'axios'; // Import Axios
import { LineChart, Line } from 'recharts';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
export default function FetchCSVData(props) {
    const [csvData, setCsvData] = useState([]);
    const data = csvData;

    useEffect(() => {
        fetchCSVData();    // Fetch the CSV data when the component mounts
    }, []); // The empty array ensures that this effect runs only once, like componentDidMount
    const filterDataByState = (state) => {
        return csvData.filter(row => row.STATUS === state).length;
    }

    const idleStateCount = filterDataByState('Idle State (Machine ON)');
    const machineOnCount = filterDataByState('Machine ON (Under Load)');
    const machineOffCount = filterDataByState('Machine OFF');

    const barChartData = [
        { name: 'Idle state (Machine ON)', value: idleStateCount },
        { name: 'Machine ON(under load)', value: machineOnCount },
        { name: 'Machine OFF', value: machineOffCount },
    ];
    const pieChartData = [
        { name: 'Idle state (Machine ON)', value: idleStateCount },
        { name: 'Machine ON(under load)', value: machineOnCount },
        { name: 'Machine OFF', value: machineOffCount },
    ];

    const fetchCSVData = () => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpi1On88FpEAJRgflIfhot51gry9onJvTG8wmXEYlPmIOf-taLRZWUJNBvZPAaEIbrmrGyITq4rzm5/pub?output=csv'; // Replace with your Google Sheets CSV file URL

        axios.get(csvUrl)    // Use Axios to fetch the CSV data
            .then((response) => {
                const parsedCsvData = parseCSV(response.data);        // Parse the CSV data into an array of objects
                setCsvData(parsedCsvData);        // Set the fetched data in the component's state
                console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
            })
            .catch((error) => {
                console.error('Error fetching CSV data:', error);
            });
    }

    function parseCSV(csvText) {
        const rows = csvText.split(/\r?\n/);        // Use a regular expression to split the CSV text into rows while handling '\r'
        const headers = rows[0].split(',');        // Extract headers (assumes the first row is the header row)
        const data = [];        // Initialize an array to store the parsed data
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');          // Use the regular expression to split the row while handling '\r'
            const rowObject = {};
            for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = rowData[j];
            }
            data.push(rowObject);
        }
        return data;
    }
    return (
      <div>
          <p className='p'>DASHBOARD</p>
          <div>
          <LineChart width={1500} height={300} data={csvData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="TIME" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="CURRENT" stroke="#8884d8" />
            </LineChart>
          </div>
         
          <div className='chart'>
            <div>
            <BarChart
                width={700}
                height={300}
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
            </div>
            <div>
            <PieChart width={400} height={400}>
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
        </div>
        
      </div>
      
      

  );

}