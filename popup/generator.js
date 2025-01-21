export default class QRCodeGen{
    makeQR(element, width, height, data, settings) {
        new QRCode(element, {
            text: data,
            width: width,
            height: height,
            colorDark: settings.foreground,
            colorLight: settings.background,
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}