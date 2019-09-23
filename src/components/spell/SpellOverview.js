import React, { Component } from 'react';
import '../../assets/css/SpellOverview.css';
import Spell from './Spell';
import SpellView from './SpellView';
import SpellPagination from './SpellPagination';
import SpellSearchBar from './SpellSearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellOverview extends Component {
    state = {
        currentSpellList: { spells: [] },
        currentSelectedSpell: null,
        width: "100%"
    }

    receiveSpells = (evt, result) => {
        this.setState({
            ...this.state,
            currentSpellList: {
                ...this.state.currentSpellList,
                spells: result
            }
        })
    }

    componentDidMount() {
        ipcRenderer.send('getSearchSpells', { step: 10, start: 0 });
        ipcRenderer.on("getSearchSpellsResult", this.receiveSpells);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSearchSpellsResult", this.receiveSpells);
    }

    viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    render() {
        return (
            <div id="overview">
                <SpellSearchBar />
                <div id="spellContent">
                    <div id="spells" style={{ width: `${this.state.width}` }}>
                        {this.state.currentSpellList.spells.map((spell, index) => {
                            return <Spell delay={index} spell={spell} key={spell.spells_id} onClick={() => this.viewSpell(spell)} />;
                        })}
                    </div>
                    <SpellView spell={this.state.currentSelectedSpell} />
                </div>
                <SpellPagination />
            </div>
        )
    }
}

export default SpellOverview;