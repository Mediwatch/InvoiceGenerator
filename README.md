# Invoice generator
Generate docx invoices using docx-templates.

### Usage
invoice_generator DOCX_TEMPLATE_FILE [OPTION]...

### Options
-o **NAME**, --output **NAME**\
    Name of output file to generate, output.pdf/output.docx by default (depending on -f option)

-f **FORMAT**, --format **FORMAT**\
    Name of the format of the generated file to use, either **docx** or **pdf**, pdf by default

-w, --overwrite\
    Overwrite output file if it already exists

-d **DATA**, --data **DATA**\
    A JSON string representing the data to use on the template

-D **FILE**, --data-file **FILE**\
    A JSON file representing the data to use on the template

-h, --help\
    Display an help message an exit

### Compile and Run
Install:\
```$ npm i```

Other dependencies:\
libreoffice

Compile:\
```$ npm run build-bin-lin```
Compilation for windows or mac doesn't work at the moment.

Run:\
```$ node .```

Clean (removes dependencies and compiled js files):\
```$ npm run clean```
