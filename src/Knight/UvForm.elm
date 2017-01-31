module Knight.UvForm exposing (weaponUvForm, armourUvForm, trinketForms)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput, onClick)
import BaseTypes exposing (..)
import UV exposing (..)
import Trinket
import Util exposing (lIndex, atIndex, replace, remove)
import View.Shortcuts exposing (selectList, selectListExclude, spacer)

strengths = [Low, Medium, High, VeryHigh, Ultra, Maximum]

weaponUvForm = uvForms
  composedWeaponUvs
  [Low, Medium, High, VeryHigh]
armourUvForm = uvForms
  (composedDefenceUvs ++ composedStatusUvs)
  [Low, Medium, High, Maximum]

asName name = {name = name}

defenceUvs =
  [ Normal
  , Piercing
  , Elemental
  , Shadow
  ]

statusUvs =
  [ Fire
  , Freeze
  , Shock
  , Poison
  , Stun
  , Curse
  ]

weaponUvs =
  [ ASI
  , CTR
  , Beast
  , Fiend
  , Gremlin
  , Slime
  , Construct
  , Undead
  ]

composedWeaponUvs =
  List.map (\bonus -> WeaponUV(bonus, Low)) weaponUvs

composedDefenceUvs =
  List.map (\dType -> DefenceUV(dType, Low)) defenceUvs

composedStatusUvs =
  List.map (\status -> StatusUV(status, Low)) statusUvs

uvName equip =
  case equip of
    WeaponUV  (bonus, strength)-> toString bonus
    DefenceUV (dType, strength)-> toString dType
    StatusUV (status, strength)-> toString status
    Hearts num -> "HP"
uvStrength equip =
  case equip of
    WeaponUV  (bonus, strength) -> strength
    DefenceUV (dType, strength) -> strength
    StatusUV (status, strength) -> strength
    Hearts num -> atIndex (num - 1) strengths |> Maybe.withDefault Low

uvForms availableUvs uvStrengths message equipment =
  let
    uvNames = availableUvs |> List.map uvName
    uvs = equipment.uvs
    existingNames = List.map uvName uvs
    swapType equip index option =
      let
        bonus
          = weaponUvs
          |> List.filter (\bType -> option.name == (toString bType))
          |> List.head
        defence
          = defenceUvs
          |> List.filter (\dType -> option.name == (toString dType))
          |> List.head
        status
          = statusUvs
          |> List.filter (\sType -> option.name == (toString sType))
          |> List.head
        uv =
          case bonus of
            Just thing -> WeaponUV (thing, uvStrength equip)
            Nothing ->
          case defence of
            Just thing -> DefenceUV (thing, uvStrength equip)
            Nothing ->
          case status of
            Just thing -> StatusUV (thing, uvStrength equip)
            Nothing -> StatusUV (None, Low)
      in
        message <| replace uvs index uv
    swapStrength equip index value =
      let
        strength =
          String.toInt value
            |> Result.withDefault 0
            |> (flip atIndex) uvStrengths
            |> Maybe.withDefault Low
        uv =
          case equip of
            WeaponUV (bonus, str) -> WeaponUV (bonus, strength)
            DefenceUV (bonus, str) -> DefenceUV (bonus, strength)
            StatusUV (bonus, str) -> StatusUV (bonus, strength)
            Hearts num ->
              lIndex strength strengths
                |> Maybe.withDefault 0
                |> (+) 1
                |> Hearts
      in
        message <| replace uvs index uv
    addUv =
      let
        excluded = uvs |> List.map uvName
        uv =
          availableUvs
            |> List.filter (\uv -> List.member (uvName uv) excluded |> not)
            |> List.head
            |> Maybe.withDefault( StatusUV (None, Low) )
      in
        message <| uvs ++ [ uv ]
    removeUv index =
      message <| remove index uvs
    uvForm index equip =
      div [ class "item sub" ]
        [ Html.label [] [ "UV" ++ (index + 1 |> toString) |> text ]
        , selectListExclude
          (uvs |> List.map uvName |> List.map asName)
          (swapType equip index)
          (uvNames |> List.map asName)
          (equip |> uvName |> asName)
        , spacer
        , Html.label [] [ equip |> uvStrength |> toString |> text ]
        , input
          [ type_ "range"
          , Html.Attributes.min "0"
          , Html.Attributes.max "3"
          , onInput <| swapStrength equip index
          , equip
            |> uvStrength
            |> (flip lIndex) uvStrengths
            |> Maybe.withDefault 0
            |> toString
            |> value
          ] []
        , spacer
        , button
          [ onClick <| removeUv index ]
          [ text "-" ]
        ]
  in
    List.indexedMap uvForm uvs ++ (
      if List.length uvs < 3 then
        [ button [ onClick addUv ] [ text "+ UV" ] ]
      else
        []
    )

trinketForm swap remove index trinket =
  let
    label = "Trinket " ++ (toString <| index + 1)
  in
    div [ class "item slot" ]
      [ Html.label [] [ text label ]
      , selectList (swap index) Trinket.trinkets trinket
      , spacer
      , button [ onClick <| remove index ] [ text "-" ]
      ]

trinketForms message trinkets =
  let
    swapTrinket index trinket =
      message <| replace trinkets index trinket
    addTrinket =
      message <| trinkets ++ [ Trinket.penta ]
    removeTrinket index =
      message <| remove index trinkets
    form = trinketForm swapTrinket removeTrinket
  in
    List.indexedMap form trinkets ++ (
      if List.length trinkets < 2 then
        [ button [ onClick addTrinket ] [ text "+ Trinket" ] ]
      else
        []
    )
