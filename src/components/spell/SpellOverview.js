import React, { Component } from 'react';
import '../../assets/css/spell/SpellOverview.css';
import Spell from './Spell';
import SpellPagination from './SpellPagination';
import SpellSearchBar from './SpellSearchBar';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

class SpellOverview extends Component {
    state = {
        currentSpellList: { spells: [] },
        currentSelectedSpell: null
    }

    receiveSpells = (evt, result) => {
        this.setState({
            ...this.state,
            currentSpellList: {
                spells: result
            }
        })
    }

    updateSpell = (evt, result) => {
        let { spellStep, spellStart } = result;
        ipcRenderer.send('getSearchSpells', { step: spellStep, start: spellStart });
    }

    componentDidMount() {
        ipcRenderer.send('getSearchSpells', { step: 10, start: 0 });
        ipcRenderer.on("getSearchSpellsResult", this.receiveSpells);
        ipcRenderer.on("spellsUpdated", this.updateSpell);
    }
    componentWillUnmount() {
        ipcRenderer.removeListener("getSearchSpellsResult", this.receiveSpells);
        ipcRenderer.removeListener("spellsUpdated", this.updateSpell);
    }

    viewSpell = (spell) => {
        ipcRenderer.send('openSpellView', spell);
    }

    render() {
        return (
            <div id="overview">
                <div id="spellOverview">
                    <SpellSearchBar />
                    <div id="spells">
                        {this.state.currentSpellList.spells.map((spell, index) => {
                            return <Spell delay={index} spell={spell} key={spell.spell_id} onClick={() => this.viewSpell(spell)} />;
                        })}
                    </div>
                </div>
                <SpellPagination />
            </div>
        )
    }
}

export default SpellOverview;