import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Subhead } from '@vkontakte/vkui';
import { tapticSelectNotification } from '../vk';
import { setInterests } from '../store/data/actions';

class InterestsPick extends Component {
    setInterests(i) {
        tapticSelectNotification();
        this.props.setInterests(i);
    }

    render() {
        return (
            <div className="chips">
                {this.props.defaultInterests.map((interest, i) => (
                    <div
                        key={i}
                        onClick={() => this.setInterests(i)}
                        className={`chip ${this.props.interests.includes(i) && 'chip--active'}`}
                    >
                        <Subhead weight="medium" className="chip__text">
                            {' '}
                            {interest}
                        </Subhead>
                    </div>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        interests: state.data.interests,
        defaultInterests: state.data.defaultInterests,
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ setInterests }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InterestsPick);
