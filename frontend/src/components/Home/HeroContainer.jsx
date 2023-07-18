import React from 'react'
import God from '../../images/vishwakarma.png'


const HeroContainer = () => {
    return (
        <section className='hero-section'>
            <div className='container hero-container'>
                <div>
                    <h4 className=''>જય શ્રી વિશ્વકર્મા ભગવાન</h4>
                    <p className=''>
                        વિશ્વકર્મન શબ્દ મૂળરૂપે કોઈપણ સર્વોચ્ચ દેવ માટેના ઉપનામ તરીકે અને ઈન્દ્ર અને સૂર્યના લક્ષણ તરીકે વપરાતો હતો. ઋગ્વેદના દસમા પુસ્તકમાં વિશ્વકર્મણ નામ પાંચ વખત આવે છે. ઋગ્વેદના બે સ્તોત્રો વિશ્વકર્મણને સર્વ-દ્રષ્ટા તરીકે ઓળખાવે છે, અને દરેક બાજુ આંખો, ચહેરા, હાથ અને પગ ધરાવે છે અને તેની પાંખો પણ છે. બ્રહ્મા, સૃષ્ટિના દેવ, જે ચાર મુખવાળા અને ચાર હાથવાળા છે તે આ પાસાઓમાં તેમના જેવા છે. તેને તમામ સમૃદ્ધિના સ્ત્રોત તરીકે રજૂ કરવામાં આવે છે, તેના વિચારોમાં ઝડપી અને દ્રષ્ટા, પુરોહિત અને વાણીના સ્વામી તરીકે શીર્ષક આપવામાં આવે છે.
                    </p>
                </div>
                <div className='image-container'>
                    <img src={God} alt='Shree Vishvakarma Bhagwan'></img>
                </div>
            </div>

        </section>
    )
}

export default HeroContainer
