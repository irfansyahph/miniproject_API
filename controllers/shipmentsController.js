const { db, dbQuery } = require('../config/database')

module.exports = {
    getData: async (req, res) => {
        // db.query(`Select * from shipments`, (err, results) => {
        //     if (err) {
        //         res.status(500).send(err)
        //     }
        //     res.status(200).send(results)
        // })
        try {
            // console.log(req.query.idusers)
            let sqlGetShipments = `Select * from shipments ${req.query.resi ? `WHERE resi=${req.query.resi}` : ""};`
            let sqlGetShipmentsStatus = `Select * from shipments_status;`

            let getShipments = await dbQuery(sqlGetShipments)
            let getShipmentsStatus = await dbQuery(sqlGetShipmentsStatus)
            console.log(getShipments)
            console.log(getShipmentsStatus)

            let newData = getShipments.map((value, index) => {
                value.stats = []
                getShipmentsStatus.forEach((val, idx) => {
                    if (value.resi == val.resi) {
                        value.stats.push(val)
                    }
                })
                return value
            })

            res.status(200).send(newData)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // input: (req, res) => {
    //     function getRandom(length) {
    //         return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    //     }
    //     let inputScript = `INSERT INTO shipments values (${getRandom(9)},'${req.body.namapenerima}','${req.body.alamatpenerima}','${req.body.telponpenerima}',
    //     '${req.body.namapengirim}','${req.body.alamatpengirim}','${req.body.telponpengirim}','${req.body.jenisbarang}',${req.body.beratbarang},
    //     ${req.body.biayajasa},'On Process')`

    //     db.query(inputScript, (err, results) => {
    //         if (err) {
    //             console.log(err)
    //             res.status(500).send(err)
    //         }
    //         res.status(200).send({ messages: "Input Success ✔", results })
    //     })
    // },
    input: async (req, res) => {
        try {
            // function getRandom(length) {
            //     return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
            // }
            // let { namapenerima, alamatpenerima, telponpenerima, namapengirim, alamatpengirim, telponpengirim, jenisbarang, beratbarang, biayajasa } = JSON.parse(req.body.data);
            let resi = Math.floor(Math.pow(10, 8) + Math.random() * 9 * Math.pow(10, 8));
            
            let sqlShipments = `INSERT INTO shipments values ('${resi}','${req.body.namapenerima}','${req.body.alamatpenerima}','${req.body.telponpenerima}',
            '${req.body.namapengirim}','${req.body.alamatpengirim}','${req.body.telponpengirim}','${req.body.jenisbarang}',${req.body.beratbarang},
            ${req.body.biayajasa})`
            let insertShipments = await dbQuery(sqlShipments)
            console.log(insertShipments)

            if (insertShipments.affectedRows) {
                let sqlShipmentsStatus = `INSERT INTO shipments_status values (null,'${resi}','On Process',NOW());`
                await dbQuery(sqlShipmentsStatus)
            }
            res.status(200).send({ message: "Add Data Success" })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    update: async (req, res) => {
        try {
            console.log(req.body)
            let { resi, namapenerima, telponpenerima, alamatpenerima, namapengirim, telponpengirim, alamatpengirim, jenisbarang, beratbarang, biayajasa } = req.body
            let resUpdate = await dbQuery(`UPDATE shipments set namapenerima=${db.escape(namapenerima)}, telponpenerima=${db.escape(telponpenerima)},
            alamatpenerima=${db.escape(alamatpenerima)},namapengirim=${db.escape(namapengirim)},telponpengirim=${db.escape(telponpengirim)},alamatpengirim=${db.escape(alamatpengirim)},
            jenisbarang=${db.escape(jenisbarang)},beratbarang=${db.escape(beratbarang)},biayajasa=${db.escape(biayajasa)}   
            WHERE resi=${db.escape(resi)};`);

            res.status(200).send({ message: "Update shipments success✅", success: true })

        } catch (error) {
            console.log(error)
        }
    },
    updateStatus: async (req, res) => {
        try {
            console.log(req.body)
            let { resi, status } = req.body
            // 1. memperbarui data table products utama
            let resUpdate = await dbQuery(`UPDATE shipments_status set status=${db.escape(status)} , date=NOW()   
            WHERE resi=${db.escape(resi)};`);

            res.status(200).send({ message: "Update status success✅", success: true })

        } catch (error) {
            console.log(error)
        }
    },
    delete: async (req, res) => {
        try {
            let sqlShipments = `DELETE from shipments WHERE resi=${db.escape(req.params.resi)};`
            await dbQuery(sqlShipments)

            res.status(200).send({ message: "Delete shipment success ✅" })

        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    }
}