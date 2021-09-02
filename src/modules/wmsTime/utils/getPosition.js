/**
 * Returns the new position of the swiper depending on the input event.
 *
 * @param {KeyboardEvent.keydown | MouseEvent.mousemove} event DOM Event.
 * @param {number} currentPos The current x-axis position of the swiper.
 * @param {number} keyboardMovement Value in pixels that the swiper should be moved when using the arrow keys.
 * @returns {number} The new position of the swiper.
 */
export default function getPosition (event, currentPos, keyboardMovement) {
    let position = 0;

    if (event.type === "mousemove") {
        position = event.clientX;
    }
    else if (event.type === "keydown") {
        position = currentPos;

        if (event.key === "ArrowLeft") {
            position -= keyboardMovement;
        }
        else if (event.key === "ArrowRight") {
            position += keyboardMovement;
        }
    }

    // If the swiper was moved out of the window, it is set to the border of the window instead
    if (position < 0) {
        return 0;
    }
    if (position > window.innerWidth) {
        return window.innerWidth;
    }
    return position;
}
