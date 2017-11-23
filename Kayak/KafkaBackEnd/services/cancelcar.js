const mysql = require('mysql');

function handle_request(msg, callback){

    let d1, d2, city,carid, flag = false,id1, id2, id3;

    const db = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password: '',
        database: 'cars'
    });

    db.connect((err) => {
        if(err) throw err;
        console.log("mysql connected");
    });

    console.log("In handle request:"+ JSON.stringify(msg));
    let sql = 'SELECT * FROM bookings WHERE bookingid = ?';
    let query = db.query(sql,[msg.id], (err, rows) => {

        d1 = (rows[0].s_date);
        d2 = (rows[0].e_date);
        city = rows[0].city;
        carid = rows[0].carid;

        let sql = 'SELECT * FROM list WHERE e_date = ? AND carid = ? AND city = ?';
        let query = db.query(sql,[d1 ,carid, city], (err, rows) => {

            if(rows.length >0){
                console.log("found one");
                flag = true;
                console.log(rows[0].id);
                id1 = rows[0].id;
                let sql1 = 'UPDATE list SET e_date = ? WHERE id = ?';
                let query1 = db.query(sql1,[d2 ,rows[0].id], (err, rows) => {
                    if(err) throw err;

                });
            }
        });

        let sql1 = 'SELECT * FROM list WHERE s_date = ? AND carid = ? AND city = ?';
        let query1 = db.query(sql1,[d2 ,carid, city], (err, rows) => {

            if(rows.length >0){
                console.log("found two");
                console.log(rows[0].id);
                id2 = rows[0].e_date;
                id3 = rows[0].id;
                let sql1 = 'UPDATE list SET s_date = ? WHERE id = ?';
                let query1 = db.query(sql1,[d1 ,rows[0].id], (err, rows) => {
                    if(err) throw err;

                });
                if(flag === true){
                    console.log("new");
                    let sql1 = 'UPDATE list SET e_date = ? WHERE id = ?';
                    let query1 = db.query(sql1,[id2 ,id1], (err) => {
                        if(err) throw err;
                        let sql = 'DELETE FROM list WHERE id = ?';
                        let query = db.query(sql,[id3], (err) => {
                            if(err) throw err;
                            console.log("deleted");
                        });
                        let sql1 = 'DELETE FROM bookings WHERE bookingid = ?';
                        let query1 = db.query(sql1,[msg.id], (err) => {
                            if(err) throw err;
                            console.log("deleted");
                        });

                    });

                }
            }
        });
    });

    callback(null,"asa");


}

exports.handle_request = handle_request;