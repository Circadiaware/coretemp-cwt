# coretemp-cwt
Circadian rhythm nadirs inference using continuous wave transforms on non invasive core body temperature. Allows visualization and also outputs actual minimum temperature times for each day. Code is messy (was hacked together for personal use and then published w/o modification)

## Author and license

This software was made by RoboTeddy and has been dedicated to the public domain

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



## Note about private information in code

The CORE body temp password written into the codebase has since been changed, and the firebase api creds hardcoded may still work but I don't mind that they're public.
