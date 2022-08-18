# coretemp-cwt
Circadian rhythm nadirs inference using continuous wave transforms on non invasive core body temperature. Allows visualization and also outputs actual minimum temperature times for each day. Code is messy (was hacked together for personal use and then published w/o modification).

## Usage

The package is composed of two scripts:

* fetch.mjs , a node.js script to automatically download core body temperature data from the GreenTEG CORE Cloud. Usage of the script is optional, as the data can be manually downloaded by accessing the website, selecting the period and clicking on the CSV download button.
* analyze.m , a MATLAB script to calculate the circadian rhythm nadirs using continuous wave transforms from a CSV file containing one temperature value per row. See for example [this published dataset](https://figshare.com/articles/dataset/greenteg-core-axillary-5min/15001182).

## Author and license

This software was made by RoboTeddy and has been dedicated to the public domain.

The package is maintained by the Circadiaware collective, which can be contacted in case of issues (please open a ticket).

To contact the author or maintainers, please use [the Discussions tab](https://github.com/Circadiaware/coretemp-cwt/discussions) on GitHub.

## Example fit

![image](https://user-images.githubusercontent.com/172271/185003794-a671a896-37d4-42d0-be70-45d187c8351c.png)

Temperature nadirs:

```
   07-Aug-2022 04:40:00
   08-Aug-2022 04:30:00
   09-Aug-2022 04:25:00
   10-Aug-2022 04:45:00
   11-Aug-2022 05:15:00
   12-Aug-2022 05:15:00
   13-Aug-2022 04:55:00
   14-Aug-2022 04:40:00
```
