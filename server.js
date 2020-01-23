const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table2');

const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "root",
    password: "incorrect",
    database: "employeeManagment_db"
  });

let initialQuestion = 'What would you like to do';
let initialList= ['View All Employees','View All Employees By Department','View All Employees By Manager','Add New Employee','Remove Employee','Update Employee Role'];

initialUserPrompt(initialQuestion,initialList).then( response => {
    switch (response.userChoice) {
        case 'View All Employees':
            let viewAllQuery = 
            `SELECT a.id id, first_name, last_name,
                title, department, salary, manager    
            FROM employeeManagment_db.employees a 
            LEFT JOIN (SELECT a.id id, title,salary,
                    department_name as department 
                FROM employeeManagment_db.roles a 
                LEFT JOIN employeeManagment_db.departments b 
                    ON a.department_id=b.id) b 
            ON a.role_id=b.id ORDER BY id`;
            connection.connect(function(err) {
                if (err) throw err;
                getEmployeeData(viewAllQuery);
            });
            break;
        case 'View All Employees By Department':
            let viewAllByDeptQuery = 
            `SELECT a.id id, first_name, last_name,
                title, department, salary, manager    
            FROM employeeManagment_db.employees a 
            LEFT JOIN (SELECT a.id id, title,salary,
                    department_name as department 
                FROM employeeManagment_db.roles a 
                LEFT JOIN employeeManagment_db.departments b 
                    ON a.department_id=b.id) b 
            ON a.role_id=b.id ORDER BY department`;
            connection.connect(function(err) {
                if (err) throw err;
                getEmployeeData(viewAllByDeptQuery);
            });
            break;
        case 'View All Employees By Manager':
            let viewAllByManagerQuery = 
            `SELECT a.id id, first_name, last_name,
                title, department, salary, manager    
            FROM employeeManagment_db.employees a 
            LEFT JOIN (SELECT a.id id, title,salary,
                    department_name as department 
                FROM employeeManagment_db.roles a 
                LEFT JOIN employeeManagment_db.departments b 
                    ON a.department_id=b.id) b 
            ON a.role_id=b.id ORDER BY manager`;
            connection.connect(function(err) {
                if (err) throw err;
                getEmployeeData(viewAllByManagerQuery);
            });
            break;
        case 'Add New Employee':
            createEmployeeData();
            break;
        case 'Remove Employee':
            deleteEmployeeData();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        default:
            break;
    }
})

function getEmployeeData(query){    
    connection.query(query, function(err, res) {
        if (err) throw err;
        buildViewTable(res);
        connection.end();
    });
}

function createEmployeeData(){
    let employeeList=[];
    let roleList=[];
    let employeeNameQuery = `SELECT 
        concat(id,'. ',first_name,' ',last_name) AS name_list   
        FROM employeeManagment_db.employees`;
    let roleQuery=`SELECT 
        concat(id,'. ',title) AS role_list  
        FROM employeeManagment_db.roles`;
    connection.query(employeeNameQuery, function(err, res) {
        if (err) throw err;
        res.forEach(element => {
            employeeList.push(element.name_list)
        });
        connection.query(roleQuery, function(err, res) {
            if (err) throw err;
            res.forEach(element => {
                roleList.push(element.role_list)
            });
            inquirer.prompt([
                {
                    type: 'input',
                    message: `What is the new employee's first name?`,
                    name: 'firstName'
                },
                {
                    type: 'input',
                    message: `What is the new employee's last name?`,
                    name: 'lastName'
                },
                {
                    type: 'list',
                    message: `What is the new employee's role?`,
                    name: 'role',
                    choices: roleList
                },
                {
                    type: 'list',
                    message: `What is the new employee's manager?`,
                    name: 'manager',
                    choices: employeeList
                }
            ]).then(response => {
                //condition ? exprIfTrue : exprIfFalse
                let managerName = response.manager.split('.')[1]};
                let firstName = response.firstName;
                let lastName = response.lastName;
                let roleid = response.role.split('.')[0];
                connection.query(`INSERT INTO employeeManagment_db.employees (first_name, last_name, role_id, manager)
                VALUES ('${firstName}','${lastName}',${roleid},${managerName})`, function(err, res) {
                    if (err) throw err;
                    console.log(`Created new Employee ${firstName} ${lastName} in database`)
                    connection.end();
                });
            });
        });
    });
};


function deleteEmployeeData(){
    let employeeList=[];
    connection.connect(function(err) {
        if (err) throw err;
        // console.log("connected as id " + connection.threadId);
        let employeeNameQuery = `SELECT 
        concat(id,'. ',first_name,' ',last_name) AS name_list   
        FROM employeeManagment_db.employees `;
        connection.query(employeeNameQuery, function(err, res) {
            if (err) throw err;
            res.forEach(element => {
                employeeList.push(element.name_list);
            });
            initialUserPrompt('Choose employee to be deleted',employeeList)
            .then( response =>{
                let id = response.userChoice.split('.')[0];
                let name = response.userChoice.split('.')[1];
                connection.query(`DELETE FROM employeeManagment_db.employees WHERE id=${id}`, function(err, res) {
                    if (err) throw err;
                    console.log(`Removed ${name} from database`);
                    connection.end();
                })
            })
        })
    });
}

function updateEmployeeRole(){
    let employeeList=[];
    let roleList=[];
    connection.connect(function(err) {
        if (err) throw err;
        let employeeNameQuery = `SELECT 
        concat(id,'. ',first_name,' ',last_name) AS name_list   
        FROM employeeManagment_db.employees `;
        connection.query(employeeNameQuery, function(err, res) {
            if (err) throw err;
            res.forEach(element => {
                employeeList.push(element.name_list);
            });
            initialUserPrompt('Choose employee whose role needs to be updated',employeeList)
            .then( response =>{
                let roleQuery=`SELECT 
                concat(id,'. ',title) AS role_list  
                FROM employeeManagment_db.roles `;
                let name_id = response.userChoice.split('.')[0];
                let name = response.userChoice.split('.')[1];
                connection.query(roleQuery, function(err, res) {
                    if (err) throw err;
                    res.forEach(element => {
                        roleList.push(element.role_list);
                    });
                    initialUserPrompt('Choose new role',roleList)
                    .then( response =>{
                        let role_id = response.userChoice.split('.')[0];
                        let role = response.userChoice.split('.')[1];
                        connection.query(`UPDATE employeeManagment_db.employees SET role_id = ${role_id} WHERE id=${name_id}`, function(err, res) {
                            if (err) throw err;
                            console.log(`Updated the role for ${name} to ${role} in database`);
                            connection.end();
                        })
                    })
                })
            })
        })
    });
}

function buildViewTable(obj){
    var table = new Table({
        head: ['id', 'first_name', 'last-name', 'title', 'department','salary','manager']
    });
    obj.forEach(element => {
        table.push([element.id,element.first_name,element.last_name,element.title,element.department,element.salary,element.manager]);
    });
    console.log(table.toString());
}

function initialUserPrompt(question,list){
    return inquirer.prompt(
    {
        type: 'list',
        message: question,
        name: 'userChoice',
        choices: list
    });
}