import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

export const printPDF = async (
  orderId,
  totalHarga,
  tanggalOrder,
  dataUser,
  dataItemInvoice,
) => {
  let tableBodyContent = '';

  dataItemInvoice.map((item, index) => {
    tableBodyContent += `
            <tr>
              <td class=" px-0" style=" display: flex; justify-content: center;">${
                index + 1
              }</td>
              <td class="px-0 mt-5" style="text-transform: capitalize">
                ${item.tanggal}
                <p><strong>Lapangan ${item.lapangan}</strong></p>
                <p>Pukul: ${item.waktu}</p>
              </td>
              <td class="vertical-center px-0" >Rp. ${item.totalHarga},-</td>
            </tr>
          `;
  });

  const htmlContent = `
      <!DOCTYPE html>
      <html>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
      
        <head>
          <title>Hello, World!</title>
          <link rel="stylesheet" href="styles.css" />
          <style>
          /* Tambahkan gaya sesuai kebutuhan Anda */
          .px-0 {
              padding: 0;
          }
          .vertical-center {
              vertical-align: middle;
          }
      </style>
        </head>
        <body>
          <div class="mt-6 mb-7">
            <div class="row justify-content-center">
              <div class="col-lg-12 col-xl-7">
                <div>
                  <div class="card-body p-3" style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                    <h4>BUKTI PEMBAYARAN / INVOICE</h4>
                        <h2 class="text-warning">${orderId}</h2>
                        <p class="fs-sm">
                            Tanda Pembayaran Pesan Jadwal Lapangan Futsal.
                        </p>
                    </div>
                    <div>
                        <img class="img-responsive" alt="iamgurdeeposahan" src="https://firebasestorage.googleapis.com/v0/b/futsalpro-767b4.appspot.com/o/logo%20futsalpro.png?alt=media&token=2651fe42-3b61-4d35-a56a-7a2e656143f6" style="width: 200px;">			
                    </div>
                  </div>
      
                  <div class="card-body p-3 border-top border-gray-300 pt-4 mt-4" style="display: flex; justify-content: space-between; align-items: center;">
          
      
                    <div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="text-muted mb-2">Pelanggan a.n</div>
                          <strong>${dataUser.fullName}</strong>
                          <p class="fs-sm">
                          ${dataUser.alamat}
                            <br 
                            <a href="#!" class="text-purple">${dataUser.email}</a>
                          </p>
                        </div>
                      </div>
                    </div>
    
                    <div>
                    <div class="row">
                      <div class="col-md-6 text-md-end">
                        <div class="text-muted mb-2">Tanggal Pembayaran</div>
                        <strong>${tanggalOrder}</strong>
                      </div>
                    </div>
                  </div>
    
                    </div>
    
    
      
                    <table id="myTable" class="table border-bottom border-gray-200 mt-3">
                      <thead>
                        <tr class="bg-secondary">
                          <th
                            scope="col"
                            class="fs-sm text-light text-uppercase-bold-sm px-0,"
                            style=" display: flex; justify-content: center;"
                          >
                            No.
                          </th>
                          <th
                            scope="col"
                            class="fs-sm text-light text-uppercase-bold-sm px-0,"
                          >
                            Nama Item
                          </th>
                          <th
                            scope="col"
                            class="fs-sm text-light text-uppercase-bold-sm px-0"
                          >
                            Harga
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                      ${tableBodyContent}
                    </tbody>
                    </table>
    
    
                    <div class="card-body p-3" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                    <p class="text-muted me-2">Status Pembayaran :</p>
                    <img class="img-responsive" alt="iamgurdeeposahan" src="https://firebasestorage.googleapis.com/v0/b/futsalpro-767b4.appspot.com/o/lunas_.png?alt=media&token=0369e8a0-3ddc-47b8-9fba-8b0519c087c0" style="width: 200px;">		
                    </div>
                    <div class="mt-5">
                      <div class="d-flex justify-content-end">
                        <p class="text-muted me-3">Subtotal:</p>
                        <span>Rp. ${totalHarga},-</span>
                      </div>
                      <div class="d-flex justify-content-center">
                        <p class="text-muted me-3">Admin:</p>
                        <span>Rp. 0,-</span>
                      </div>
                      <div class="d-flex justify-content-end mt-3">
                        <h5 class="me-3">Total :</h5>
                        <h5 class="text-success">Rp. ${totalHarga},-</h5>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
    
        </body>
      </html>
    `;

  const results = await RNHTMLtoPDF.convert({
    html: htmlContent,
    fileName: 'test',
    base64: true,
  });

  await RNPrint.print({filePath: results.filePath});
};
