//Reference file
//1.background image
const back = this.game.add([
    this.game.sprite('back_country'),
    this.game.fixed(),
    this.game.pos(this.game.width() / 2, this.game.height() / 2),
    this.game.origin("center"),
    this.game.scale(1),
    this.game.fixed()
  ]);
  back.scaleTo(Math.max(
    this.game.width() /  this.bgImage.__zone_symbol__value.tex.width,
    this.game.height() / this.bgImage.__zone_symbol__value.tex.height
  ));