let UK_no_of_Masks = 100;
let UK_no_of_Gloves = 100;

let G_no_of_Masks = 100;
let G_no_of_Gloves = 50;

const UK_sale_price_of_Masks = 65;
const UK_sale_price_of_Gloves = 100;
const G_sale_price_of_Masks = 100;
const G_sale_price_of_Gloves = 150;

const transport_cost = 400;
const discount_percentage = 0.20;

const UK_passport_regx = /^b[0-9]{3}[a-zA-z]{2}[0-9a-zA-Z]{7}$/gmi;
const Germany_passport_regx = /^a[a-zA-z]{2}[0-9a-zA-Z]{9}$/gmi;
const OUT_OF_STOCK = 'OUT_OF_STOCK';

const total_Gloves = UK_no_of_Gloves + G_no_of_Gloves;
const total_Masks = UK_no_of_Masks + G_no_of_Masks;

const getInventoryDetails = (val) => {
    let args = val.split(':');
    let inventory = {};
    if (args.length == 6) {
        inventory.country = args[0];
        //inventory.passport = args[1];
        inventory.Gloves = args[2] == 'Gloves' ? args[2] : args[4];
        inventory.GlovesQty = args[2] == 'Gloves' ? args[3] : args[5];
        inventory.Mask = args[2] == 'Gloves' ? args[4] : args[2];
        inventory.MaskQty = args[2] == 'Gloves' ? args[5] : args[3];
        inventory.discountPrice = discountPrice(args[0], args[1]);
    } else if (args.length == 5) {
        inventory.country = args[0];
        inventory.Gloves = args[1] == 'Gloves' ? args[1] : args[3];
        inventory.GlovesQty = args[1] == 'Gloves' ? args[2] : args[4];
        inventory.Mask = args[1] == 'Gloves' ? args[3] : args[1];
        inventory.MaskQty = args[1] == 'Gloves' ? args[4] : args[2];
        inventory.discountPrice = transport_cost;
    }
    //console.log('Inventory: ', inventory)
    return inventory;
}

const discountPrice = (ctr, passport) => {
    if (ctr.toLowerCase() == 'uk' && Germany_passport_regx.test(passport)) {
        return (transport_cost - (transport_cost * discount_percentage));
    }
    else if (ctr.toLowerCase() == 'germany' && UK_passport_regx.test(passport)) {
        return (transport_cost - (transport_cost * discount_percentage));
    } else {
        return transport_cost;
    }
}

const UKLogic = (inventory) => {
    //console.log('UKLogic called')
    if (total_Gloves > inventory.GlovesQty && total_Masks > inventory.MaskQty) {
        if (UK_no_of_Gloves > inventory.GlovesQty && UK_no_of_Masks > inventory.MaskQty) {
            const cost = (inventory.GlovesQty * UK_sale_price_of_Gloves)
                + (inventory.MaskQty * UK_sale_price_of_Masks);
            UK_no_of_Gloves = UK_no_of_Gloves - inventory.GlovesQty;
            UK_no_of_Masks = UK_no_of_Masks - inventory.MaskQty;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        } else if (UK_no_of_Gloves > inventory.GlovesQty && UK_no_of_Masks < inventory.MaskQty) {
            const extraMask = inventory.MaskQty - UK_no_of_Masks;
            const cost = (inventory.GlovesQty * UK_sale_price_of_Gloves)
                + (UK_no_of_Masks * UK_sale_price_of_Masks)
                + (extraMask * G_sale_price_of_Masks)
                + inventory.discountPrice * returnDiscountQty(parseInt(extraMask));
            UK_no_of_Gloves = UK_no_of_Gloves - inventory.GlovesQty;
            UK_no_of_Masks = 0;
            G_no_of_Masks = G_no_of_Masks - extraMask;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        } else if (UK_no_of_Gloves < inventory.GlovesQty && UK_no_of_Masks > inventory.MaskQty) {
            const extraGloves = inventory.GlovesQty - UK_no_of_Gloves;
            const cost = (UK_no_of_Gloves * UK_sale_price_of_Gloves)
                + (inventory.MaskQty * UK_sale_price_of_Masks)
                + (extraGloves * G_sale_price_of_Gloves)
                + inventory.discountPrice * returnDiscountQty(parseInt(extraGloves));
            UK_no_of_Gloves = 0;
            UK_no_of_Masks = UK_no_of_Masks - inventory.MaskQty;
            G_no_of_Gloves = G_no_of_Gloves - extraGloves;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        } else if (UK_no_of_Gloves < inventory.GlovesQty && UK_no_of_Masks < inventory.MaskQty) {
            const extraGloves = inventory.GlovesQty - UK_no_of_Gloves;
            const extraMask = inventory.MaskQty - UK_no_of_Masks;
            const cost = (UK_no_of_Gloves * UK_sale_price_of_Gloves)
                + (UK_no_of_Masks * UK_sale_price_of_Masks)
                + (extraGloves * G_sale_price_of_Gloves)
                + (extraMask * G_sale_price_of_Masks)
                + inventory.discountPrice * returnDiscountQty(parseInt(extraGloves));
            + inventory.discountPrice * returnDiscountQty(parseInt(extraMask));
            UK_no_of_Gloves = 0;
            UK_no_of_Masks = 0;
            G_no_of_Gloves = G_no_of_Gloves - extraGloves;
            G_no_of_Masks = G_no_of_Masks - extraMask;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        }
    }
    else {
        return outOfStock()
    }
}

const GMLogic = (inventory) => {
    //console.log('GMLogic called')
    if (total_Gloves > inventory.GlovesQty && total_Masks > inventory.MaskQty) {
        if (G_no_of_Gloves > inventory.GlovesQty && G_no_of_Masks > inventory.MaskQty) {
            let buy_glvs_from_Gr = 0;
            let buy_glvs_from_UK = 0;
            let buy_mrks_from_GR = 0;
            let buy_mrks_from_UK = 0;
            let GGlovesQty = 0;
            let UGlovesQty = 0;
            let GMaskQty = 0;
            let UMaskQty = 0;
            let cost = 0;
            if (inventory.discountPrice < transport_cost) {
                buy_glvs_from_Gr = inventory.GlovesQty % 10;
                buy_glvs_from_UK = inventory.GlovesQty - buy_glvs_from_Gr;
                GGlovesQty = G_no_of_Gloves - buy_glvs_from_Gr;
                UGlovesQty = UK_no_of_Gloves - buy_glvs_from_UK;

                buy_mrks_from_GR = inventory.MaskQty % 10;
                buy_mrks_from_UK = inventory.MaskQty - buy_mrks_from_GR;
                GMaskQty = G_no_of_Masks - buy_mrks_from_GR;
                UMaskQty = UK_no_of_Masks - buy_mrks_from_UK;

                cost = (buy_glvs_from_Gr * G_sale_price_of_Gloves)
                    + (buy_mrks_from_GR * G_sale_price_of_Masks)
                    + (buy_glvs_from_UK * UK_sale_price_of_Gloves)
                    + (buy_mrks_from_UK * UK_sale_price_of_Masks)
                    + inventory.discountPrice * returnDiscountQty(parseInt(buy_glvs_from_UK))
                    + inventory.discountPrice * returnDiscountQty(parseInt(buy_mrks_from_UK));
            } else {
                buy_glvs_from_Gr = inventory.GlovesQty % 10;
                buy_glvs_from_UK = inventory.GlovesQty - buy_glvs_from_Gr;
                GGlovesQty = G_no_of_Gloves - buy_glvs_from_Gr;
                UGlovesQty = UK_no_of_Gloves - buy_glvs_from_UK;

                buy_mrks_from_GR = inventory.MaskQty;
                buy_mrks_from_UK = 0;
                GMaskQty = G_no_of_Masks - buy_mrks_from_GR;
                UMaskQty = UK_no_of_Masks - buy_mrks_from_UK;

                cost = (buy_glvs_from_Gr * G_sale_price_of_Gloves)
                    + (buy_mrks_from_GR * G_sale_price_of_Masks)
                    + (buy_glvs_from_UK * UK_sale_price_of_Gloves)
                    + (buy_mrks_from_UK * UK_sale_price_of_Masks)
                    + inventory.discountPrice * returnDiscountQty(parseInt(buy_glvs_from_UK))
                    + inventory.discountPrice * returnDiscountQty(parseInt(buy_mrks_from_UK));
            }
            return `${cost}:${UMaskQty}:${GMaskQty} ${UGlovesQty}:${GGlovesQty}`;
        } else if (G_no_of_Gloves > inventory.GlovesQty && G_no_of_Masks < inventory.MaskQty) {
            const buy_glvs_from_Gr = inventory.GlovesQty % 10;
            const buy_glvs_from_UK = inventory.GlovesQty - buy_glvs_from_Gr;
            const GGlovesQty = G_no_of_Gloves - buy_glvs_from_Gr;
            const UGlovesQty = UK_no_of_Gloves - buy_glvs_from_UK;

            const buy_mrks_from_GR = 0;
            const buy_mrks_from_UK = inventory.MaskQty - buy_mrks_from_GR;
            const GMaskQty = G_no_of_Masks;
            const UMaskQty = UK_no_of_Masks - buy_mrks_from_UK;

            const cost = (buy_glvs_from_Gr * G_sale_price_of_Gloves)
                + (buy_mrks_from_GR * G_sale_price_of_Masks)
                + (buy_glvs_from_UK * UK_sale_price_of_Gloves)
                + (buy_mrks_from_UK * UK_sale_price_of_Masks)
                + inventory.discountPrice * returnDiscountQty(parseInt(buy_glvs_from_UK))
                + inventory.discountPrice * returnDiscountQty(parseInt(buy_mrks_from_UK));

            return `${cost}:${UMaskQty}:${GMaskQty} ${UGlovesQty}:${GGlovesQty}`;
        } else if (G_no_of_Gloves < inventory.GlovesQty && G_no_of_Masks > inventory.MaskQty) {
            const extraGloves = inventory.GlovesQty - G_no_of_Gloves;
            const cost = (G_no_of_Gloves * G_sale_price_of_Gloves)
                + (inventory.MaskQty * G_sale_price_of_Masks)
                + (extraGloves * UK_sale_price_of_Gloves)
                + inventory.discountPrice * returnDiscountQty(parseInt(extraGloves));
            G_no_of_Gloves = 0;
            UK_no_of_Masks = UK_no_of_Masks - inventory.MaskQty;
            UK_no_of_Gloves = UK_no_of_Gloves - extraGloves;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        } else if (G_no_of_Gloves < inventory.GlovesQty && G_no_of_Masks < inventory.MaskQty) {
            const extraGloves = inventory.GlovesQty - G_no_of_Gloves;
            const extraMask = inventory.MaskQty - G_no_of_Masks;
            const cost = (G_no_of_Gloves * G_sale_price_of_Gloves)
                + (G_no_of_Masks * G_sale_price_of_Gloves)
                + (extraGloves * UK_sale_price_of_Gloves)
                + (extraMask * UK_sale_price_of_Masks)
                + inventory.discountPrice * returnDiscountQty(parseInt(extraGloves));
            + inventory.discountPrice * returnDiscountQty(parseInt(extraMask));
            G_no_of_Gloves = 0;
            G_no_of_Masks = 0;
            UK_no_of_Gloves = UK_no_of_Gloves - extraGloves;
            UK_no_of_Masks = UK_no_of_Masks - extraMask;

            return `${cost}:${UK_no_of_Masks}:${G_no_of_Masks} ${UK_no_of_Gloves}:${G_no_of_Gloves}`;
        }
    }
    else {
        return outOfStock()
    }
}

const returnDiscountQty = (totalQty) => {
    return Math.ceil(totalQty / 10);
}

const outOfStock = () => {
    return `${OUT_OF_STOCK}:${UK_no_of_Masks} ${G_no_of_Masks}:${UK_no_of_Gloves} ${G_no_of_Gloves}`;
}

const returnOutput = (cost, um, gm, ug, gg) => {
    return `${cost}:${um}:${gm} ${ug}:${gg}`;
}

const ReadData = (val) => {
    let inventory = getInventoryDetails(val);
    //console.log('Inventory from getInventoryDetails: ', inventory)
    if (inventory) {
        if (inventory.country.toLowerCase() == 'uk') {
            //console.log('Calling UKLogic')
            return UKLogic(inventory)
        } else if (inventory.country.toLowerCase() == 'germany') {
            //console.log('Calling GMLogic')
            return GMLogic(inventory)
        } else {
            return 'Wrong argument passed'
        }
    } else {
        return 'Wrong argument passed'
    }
}

module.exports = { ReadData }