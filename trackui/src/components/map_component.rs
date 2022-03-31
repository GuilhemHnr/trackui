use leaflet::{LatLng, Map, TileLayer, Marker, Icon};
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use yew::{html::ImplicitClone, prelude::*};
use yew::{
    utils::document,
    web_sys::{Element, HtmlElement, Node},
    Html,
};
//test-------------------------------------------------
use yew::services::storage;
use yew::services::StorageService;
use yew::services::storage::Area;
//-----------------------------------------------------
use super::control::Planes;
use serde_json::{Result, Value};
use serde::{Serialize, Deserialize};
use std::path::Path;


pub enum Msg {}

pub struct MapComponent {
    map: Map,
    lat: Point,
    container: HtmlElement,
}

impl ImplicitClone for Plane {}

#[derive(Copy, Clone, Debug, PartialEq)]
pub struct Point(pub f64, pub f64);


//plane ----------------------------------------
#[derive(Clone, Debug)]
pub struct Plane {
    pub callsign: String,
    pub lat: Point,
}

#[derive(Properties, Clone)]
pub struct Props {
    pub plane: Plane,
    pub planes: Planes,
}


//map component ----------------------------------------------

impl MapComponent {
    fn render_map(&self) -> Html {
        let node: &Node = &self.container.clone().into();
        Html::VRef(node.clone())
    }
}

impl Component for MapComponent {
    type Message = Msg;
    type Properties = Props;

    fn create(props: Self::Properties, _link: ComponentLink<Self>) -> Self {
        let container: Element = document().create_element("div").unwrap();
        let container: HtmlElement = container.dyn_into().unwrap();
        container.set_class_name("map");
        let leaflet_map = Map::new_with_element(&container, &JsValue::NULL);
        let screen = Self {
            map: leaflet_map,
            container,
            lat: props.plane.lat,
        };
        for aircraft in props.planes.list {
            screen.add_plane(aircraft);
        };
        screen
    }

    fn rendered(&mut self, first_render: bool) {
        if first_render {
            self.map.setView(&LatLng::new(self.lat.0, self.lat.1), 11.0);
            add_tile_layer(&self.map);
        }
    }

    fn update(&mut self, _msg: Self::Message) -> ShouldRender {
        false
    }

    fn change(&mut self, props: Self::Properties) -> ShouldRender {
        if self.lat == props.plane.lat {
            false
        } else {
            self.lat = props.plane.lat;
            self.map.setView(&LatLng::new(self.lat.0, self.lat.1), 11.0);
            true
        }
    }

    fn view(&self) -> Html {
        html! {
            <>
            <img class="product_card_image" src="plane.png"/>
            <div class="map-container component-container">
                {self.render_map()}
            </div>
            </>
        }
    }
}

fn add_tile_layer(map: &Map) {
    TileLayer::new(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        &JsValue::NULL,
    )
    .addTo(map);
}


#[derive(Serialize, Deserialize)]
struct IconOptions {
    iconUrl: String,
    iconSize: [u16;2],
}



impl MapComponent {

    pub fn add_plane(&self, plane: Plane) -> ShouldRender {
        //paramètrage du marqueur de l'avion
        let mark = Marker::new(&LatLng::new(plane.lat.0,plane.lat.1), &JsValue::NULL);
        let i = Icon::new( &JsValue::from_serde(&IconOptions {
            iconUrl: "ressources/plane.png".into(),
            iconSize: [50,50],
        })
        .expect("Unable to serialize icon options"),
    );
        mark.setIcon(&i);

        mark.addTo(&self.map);
        return true;
    }
}

