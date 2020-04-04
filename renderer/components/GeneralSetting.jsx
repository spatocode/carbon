import React from "react"
import { connect } from "react-redux"

const GeneralSetting = ({ themes=[], lyricsFont=[] }) => {
    return (
        <div className="GeneralSetting">
            <form>
                <div className="setting-head">
                    <h6>Theme</h6>
                    <div>
                        <div>
                            <select id="theme" name="theme">
                                {themes.map((theme, i) =>
                                    <option key={i} title={theme.toLowerCase()} selected={i === 0}>{theme}</option>
                                )}
                            </select>
                            <label for="theme">Theme</label>
                        </div>
                        <div>
                            <input type="checkbox" id="album_art" name="album_art" />
                            <label for="album_art">Album art</label>
                        </div>
                        <div>
                            <input type="checkbox" id="" name="lyrics" />
                            <label for="lyrics">Lyrics</label>
                        </div>
                    </div>
                </div>
                <div className="setting-head">
                    <h6>Lyrics</h6>
                    <div>
                        <div>
                            <input type="color" id="" name="lyrics_color" />
                            <label for="lyrics_color">Color</label>
                        </div>
                        <div>
                            <input type="number" max="35" min="10"
                                value="18" id="lyrics_font_size"
                                name="lyrics_font_size" />
                            <label for="lyrics_font_size">Size</label>
                        </div>
                        <div>
                            <select id="lyrics_font" name="lyrics_font">
                                {lyricsFont.map((font, i) =>
                                    <option key={i} title={font.toLowerCase()} selected={i === 0}>{font}</option>
                                )}
                            </select>
                            <label for="lyrics_font">Font</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

GeneralSetting.propTypes = {

}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(GeneralSetting)
