// ===============================
// PASSWORD LOGIN
// ===============================

const correctPassword = "fadhil2026"; 
// GANTI password di sini kalau mau

function checkPassword() {

let input =
document.getElementById("passwordInput").value;

if (input === correctPassword) {

document.getElementById("loginScreen").style.display = "none";

document.getElementById("mainContent").style.display = "block";

sessionStorage.setItem("isLoggedIn", "true");

} else {

document.getElementById("loginError").style.display = "block";

}

}


// ===============================
// CONFIG
// ===============================

let items = [];

let logoData = "logo.png";


// ===============================
// FORMAT RUPIAH
// ===============================

function formatRupiah(number) {

return new Intl.NumberFormat("id-ID", {

style: "currency",
currency: "IDR"

}).format(number);

}


// ===============================
// NOMOR INVOICE OTOMATIS
// ===============================

function generateInvoiceNumber() {

let counter =
localStorage.getItem("invoiceCounter");

if (!counter) {

counter = 1;

} else {

counter = Number(counter) + 1;

}

localStorage.setItem(
"invoiceCounter",
counter
);

let year =
new Date().getFullYear();

let number =
String(counter)
.padStart(3,"0");

return `INV-${year}-${number}`;

}


// ===============================
// TAMBAH ITEM
// ===============================

function addItem() {

let minute =
Number(
document.getElementById("videoMinute").value
);

let qty =
Number(
document.getElementById("qty").value
);

let itemDiscount =
Number(
document.getElementById("itemDiscount").value
);

// VALIDASI

if (!minute || minute <= 0) {

alert("Masukkan durasi video!");

return;

}

if (!qty || qty <= 0) {

alert("Masukkan qty!");

return;

}

// HARGA DIKUNCI

let pricePerMinute = 100000;

let price =
minute * pricePerMinute;

// HITUNG

let subtotalItem =
price * qty;

let total =
subtotalItem - itemDiscount;

if (total < 0) {

total = 0;

}

// NAMA ITEM

let name =
`Video ${minute} menit`;

items.push({

name,
qty,
price,
DISCOUNT: itemDiscount,
total

});

// RESET INPUT

document.getElementById("videoMinute").value = "";

document.getElementById("qty").value = 1;

document.getElementById("itemDiscount").value = 0;

// UPDATE

generateInvoice();

}


// ===============================
// EDIT ITEM
// ===============================

function editItem(index) {

let item = items[index];

// AMBIL MENIT

let minute =
item.name.match(/\d+/)[0];

document.getElementById("videoMinute").value =
minute;

document.getElementById("qty").value =
item.qty;

document.getElementById("itemDiscount").value =
item.DISCOUNT || 0;

// HAPUS LAMA

items.splice(index,1);

generateInvoice();

}


// ===============================
// DELETE ITEM
// ===============================

function deleteItem(index) {

items.splice(index,1);

generateInvoice();

}


// ===============================
// GENERATE INVOICE
// ===============================

function generateInvoice() {

let company = "TinyClayToon.id";

let customer =
document.getElementById("customerName").value;

saveCustomer(customer);

let date =
document.getElementById("date").value;


// TIME MANUAL

let paidTimeInput =
document.getElementById("time");

let paidTime = "";

if (paidTimeInput) {

paidTime = paidTimeInput.value;

}


// STATUS

let status =
document.getElementById("status").value;

let qrText =
document.getElementById("qrText").value;

let invoiceNo =
document.getElementById("invoiceNo").value;


// STYLE STATUS

let statusClass =
status === "Paid"
? "status-paid"
: "status-unpaid";

let watermarkText =
status === "Paid"
? "LUNAS"
: "BELUM LUNAS";

let watermarkClass =
status === "Paid"
? "watermark-paid"
: "watermark-unpaid";


// ===============================
// HTML
// ===============================

let html = `

<div class="watermark ${watermarkClass}">
${watermarkText}
</div>

<div class="header">

<div class="header-left">

<img src="${logoData}"
class="logo">

</div>

<div class="header-center">

<h1>INVOICE</h1>

<h2>${invoiceNo}</h2>

</div>

<div class="header-right">

<h2 class="company-name">
${company}
</h2>

</div>

</div>

<div class="invoice-info">

<table style="width:350px;">

<tr>
<td style="width:100px;"><b>Date</b></td>
<td style="width:10px;">:</td>
<td>${date}</td>
</tr>

<tr>
<td><b>Time</b></td>
<td>:</td>
<td>${paidTime}</td>
</tr>

<tr>
<td><b>Customer</b></td>
<td>:</td>
<td>${customer}</td>
</tr>

</table>

</div>

<table>

<tr>

<th class="action-col"></th>
<th>Item</th>
<th>Qty</th>
<th>Price</th>
<th>Discount</th>
<th>Total</th>

</tr>

`;

let subtotal = 0;

items.forEach((item, index) => {

html += `

<tr>

<td class="action-col">

<button onclick="editItem(${index})">
✏️
</button>

<button onclick="deleteItem(${index})">
❌
</button>

</td>

<td>${item.name}</td>

<td>${item.qty}</td>

<td>${formatRupiah(item.price)}</td>

<td>${formatRupiah(item.DISCOUNT)}</td>

<td>${formatRupiah(item.total)}</td>

</tr>

`;

subtotal += item.total;

});


// ===============================
// TOTAL
// ===============================

html += `

</table>

<table style="width:300px; margin-left:auto; margin-top:15px;">

<tr>
<td style="width:120px;"><b>Subtotal</b></td>
<td style="width:10px;">:</td>
<td style="text-align:right;">
${formatRupiah(subtotal)}
</td>
</tr>

<tr>
<td><b>Total</b></td>
<td>:</td>
<td style="text-align:right; font-weight:bold;">
${formatRupiah(subtotal)}
</td>
</tr>

</table>

<table style="width:300px; margin-left:auto; margin-top:10px;">

<tr>
<td style="width:120px;"><b>Status</b></td>
<td style="width:10px;">:</td>
<td style="text-align:right;" class="${statusClass}">
${status}
</td>
</tr>

</table>

<div id="qrcode"></div>

<div class="signature">

<p style="margin:0;">
<u>Tertanda</u>
</p>

<p style="margin:0; font-weight:bold;">
${company}
</p>

</div>

`;

document.getElementById("invoice")
.innerHTML = html;


// QR

if (qrText !== "") {

new QRCode(
document.getElementById("qrcode"),
qrText
);

}

}


// ===============================
// LOAD AWAL (FIX LOGIN + INIT)
// ===============================

window.addEventListener("load", function () {

// LOGIN CHECK

if (sessionStorage.getItem("isLoggedIn") === "true") {

document.getElementById("loginScreen").style.display = "none";

document.getElementById("mainContent").style.display = "block";

}

// INVOICE NUMBER

let invoiceInput =
document.getElementById("invoiceNo");

if (invoiceInput) {

invoiceInput.value =
generateInvoiceNumber();

}

// LOAD CUSTOMER

loadCustomers();

});


// ===============================
// CUSTOMER STORAGE
// ===============================

function saveCustomer(name) {

if (!name) return;

let customers =
JSON.parse(
localStorage.getItem("customers")
) || [];

if (!customers.includes(name)) {

customers.push(name);

localStorage.setItem(
"customers",
JSON.stringify(customers)
);

}

}


function loadCustomers() {

let customers =
JSON.parse(
localStorage.getItem("customers")
) || [];

let datalist =
document.getElementById("customerList");

if (!datalist) return;

datalist.innerHTML = "";

customers.forEach(c => {

let option =
document.createElement("option");

option.value = c;

datalist.appendChild(option);

});

}


// ===============================
// DOWNLOAD PDF
// ===============================

function downloadPDF() {

let invoiceElement =
document.querySelector("#invoice");

if (!invoiceElement) {

alert("Invoice belum dibuat!");

return;

}

// SEMBUNYIKAN ACTION

let actionColumns =
invoiceElement.querySelectorAll(".action-col");

actionColumns.forEach(col => {

col.style.display = "none";

});

html2canvas(
invoiceElement,
{
scale: 2,
useCORS: true
}

).then(canvas => {

const imgData =
canvas.toDataURL("image/png");

const pdf =
new jspdf.jsPDF(
'l',
'mm',
'a4'
);

const pageWidth = 297;

const imgWidth = pageWidth;

const imgHeight =
(canvas.height * imgWidth)
/ canvas.width;

pdf.addImage(
imgData,
'PNG',
0,
0,
imgWidth,
imgHeight
);

pdf.save("invoice.pdf");

// KEMBALIKAN ACTION

actionColumns.forEach(col => {

col.style.display = "";

});

});

}