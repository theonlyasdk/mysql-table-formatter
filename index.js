const example_input =
    `+--------+-------------+------+-----+---------+-------+
| Field  | Type        | Null | Key | Default | Extra |
+--------+-------------+------+-----+---------+-------+
| rollno | int         | NO   | PRI | NULL    |       |
| name   | varchar(10) | YES  |     | NULL    |       |
| age    | int         | YES  |     | NULL    |       |
| grade  | char(1)     | YES  |     | NULL    |       |
| stream | varchar(10) | YES  |     | NULL    |       |
+--------+-------------+------+-----+---------+-------+`;

/*

    -------- Algorithm ---------
    1. Remove 1st, 3rd and last lines to remove the seperators

    Then the table will look like this:
    | Field  | Type        | Null | Key | Default | Extra |
    | rollno | int         | NO   | PRI | NULL    |       |
    | name   | varchar(10) | YES  |     | NULL    |       |
    | age    | int         | YES  |     | NULL    |       |
    | grade  | char(1)     | YES  |     | NULL    |       |
    | stream | varchar(10) | YES  |     | NULL    |       |

    2. Split it by each line
    3. Remove first and last character (which should be the | character)
    4. Trim trailing and leading spaces
    5. Split by |
    6. First line will contain the column headers
    7. Everything else is the rows
*/

function remove_first_and_last_char(str) {
    return str.substring(1, str.length - 1);
}

function convert() {
    const input_elem = document.getElementById("input");
    const output_elem = document.getElementById("output");
    const input_value = input_elem.value;
    let lines = input_value.split('\n');
    
    lines = lines.filter(line => line.trim() !== "");
    lines = lines.map(line => line.trim());

    if (lines.length < 3) {
        output_elem.innerHTML = "Please enter a valid MySQL-style table output.";
        return;
    }

    if (lines[0].startsWith("+") && lines[lines.length - 1].endsWith("+")) {
        lines.splice(0, 1);        
    }
    
    if (lines[lines.length - 1].startsWith("+") && lines[lines.length - 1].endsWith("+")) {
        lines.splice(lines.length - 1, 1);
    }

    if (lines[1].startsWith("+") && lines[1].endsWith("+")) {
        lines.splice(1, 1);
    }

    // For markdown suport
    if (lines[1].startsWith("| -")) {
        lines.splice(1, 1);
    }

    let column_line = remove_first_and_last_char(lines[0]);
    let columns = column_line.split("|");
    let table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.fontFamily = "monospace";
    table.style.fontSize = "16px";
    table.style.backgroundColor = "#fff";
    table.style.border = "1px solid #ccc";
    let head_row = document.createElement("tr");
    columns.forEach(column => {
        let head_column = document.createElement("th");
        head_column.innerText = column;
        head_column.style.border = "1px solid #ccc";
        head_column.style.padding = "4px 8px";
        head_row.appendChild(head_column);
    });
    table.appendChild(head_row);
    lines.shift();
    lines.forEach(line => {
        let row = document.createElement("tr");
        const column_list = remove_first_and_last_char(line).split("|");
        column_list.forEach(column_elemn => {
            let column_td = document.createElement("td");
            column_td.innerText = remove_first_and_last_char(column_elemn).trim();
            column_td.style.border = "1px solid #ccc";
            column_td.style.padding = "4px 8px";
            row.appendChild(column_td);
        });
        table.appendChild(row);
    });
    output_elem.innerHTML = "";
    output_elem.appendChild(table);
}

function copyTable(sender) {
    const output_elem = document.getElementById("output");
    const range = document.createRange();
    range.selectNode(output_elem);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    sender.innerText = "Copied!";
    sender.classList.remove("btn-info");
    sender.classList.add("btn-success");
    setTimeout(() => {
        sender.innerText = "Copy Table";
        sender.classList.remove("btn-success");
        sender.classList.add("btn-info");
    }, 2000);
}

function copyTableHTML(sender) {
    const output_elem = document.getElementById("output");
    const range = document.createRange();
    range.selectNode(output_elem);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    const html = output_elem.innerHTML;
    navigator.clipboard.writeText(html).then(() => {
        sender.innerText = "Copied HTML!";
        setTimeout(() => {
            sender.innerText = "Copy HTML";
        }, 2000);
    });
    window.getSelection().removeAllRanges();
}

function copyTableUnformattedHTML(sender) {
    const output_elem = document.getElementById("output");
    const clone = output_elem.cloneNode(true);
    clone.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
    const html = clone.innerHTML;
    navigator.clipboard.writeText(html).then(() => {
        sender.innerText = "Copied Unstyled HTML!";
        setTimeout(() => {
            sender.innerText = "Copy Unstyled HTML";
        }, 2000);
    });
}

function copyTableCSV(sender) {
    const output_elem = document.getElementById("output");
    const rows = output_elem.querySelectorAll("tr");
    let csv = [];
    rows.forEach(row => {
        let cols = Array.from(row.querySelectorAll("th,td")).map(cell => {
            let text = cell.innerText.replace(/"/g, '""');
            if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                text = `"${text}"`;
            }
            return text;
        });
        csv.push(cols.join(","));
    });
    const csvText = csv.join("\n");
    navigator.clipboard.writeText(csvText).then(() => {
        sender.innerText = "Copied CSV!";
        setTimeout(() => {
            sender.innerText = "Copy CSV";
        }, 2000);
    });
}
function copyTableMarkdown(sender) {
    const output_elem = document.getElementById("output");
    const rows = output_elem.querySelectorAll("tr");
    if (!rows.length) return;

    let markdown = [];
    const headerCells = Array.from(rows[0].querySelectorAll("th,td")).map(cell => cell.innerText.trim());
    markdown.push(`| ${headerCells.join(" | ")} |`);
    markdown.push(`|${headerCells.map(() => ' --- ').join('|')}|`);
    for (let i = 1; i < rows.length; i++) {
        const cells = Array.from(rows[i].querySelectorAll("th,td")).map(cell => cell.innerText.trim());
        markdown.push(`| ${cells.join(" | ")} |`);
    }
    const markdownText = markdown.join("\n");
    navigator.clipboard.writeText(markdownText).then(() => {
        sender.innerText = "Copied Markdown!";
        setTimeout(() => {
            sender.innerText = "Copy Markdown";
        }, 2000);
    });
}

function loadExample() {
    const input_elem = document.getElementById("input");
    input_elem.value = example_input;
    convert();
}

function paste(sender) {
    navigator.clipboard.readText().then(text => {
        document.getElementById('input').value = text;
        convert();
    });
    sender.innerText = "Pasted!";
    sender.classList.add("btn-success");
    sender.classList.remove("btn-info");
    setTimeout(() => {
        sender.innerText = "Paste";
        sender.classList.remove("btn-success");
        sender.classList.add("btn-info");
    }, 2000);
}

loadExample();