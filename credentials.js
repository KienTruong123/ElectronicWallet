
// module.exports= {
//     cookieSecret: 'KienNguyenTrong',
//     mongo: {
//         development:{
//             connectionString:`mongodb+srv://ElectronicWallet:zRSiHOGsBPwh56Tr@cluster0.exstx.mongodb.net/test`
//         },
//         production:{
//             connectionString:`mongodb+srv://ElectronicWallet:zRSiHOGsBPwh56Tr@cluster0.exstx.mongodb.net/test`
//         }
//     }
// }

module.exports= {
    cookieSecret: 'KienNguyenTrong',
    mongo: {
        development:{
            connectionString:`mongodb://localhost:27017/final_project`
        },
        production:{
            connectionString:`mongodb+srv://Demoon:Demoon%402Mongo@cluster0.u3cbh.mongodb.net/test`
        }
    }
}